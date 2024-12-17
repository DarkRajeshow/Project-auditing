import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchEstimationInfoAPI, estimationInfoAPI } from '../../../../utility/api';
import numberToWords from '../../../../utility/numberToWords';

const EstimationInfo = () => {
    const { id } = useParams(); // Get project ID from URL
    const navigate = useNavigate(); // For navigation
    const [estimationInfo, setEstimationInfo] = useState({
        estimatedCost: '',
        incurredCost: ''
    });
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEstimationInfo({ ...estimationInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await estimationInfoAPI(id, estimationInfo);
            if (data.success) {
                toast.success(data.status);
                setIsSaved(true);
            } else {
                toast.error(data.status);
                setIsSaved(false);
            }
        } catch (error) {
            console.error('There was an error saving the property info!', error);
            setIsSaved(false);
        }
    };

    const handleNext = () => {
        navigate(`/projects/${id}/site-progress`);
    };

    // Function to fetch basic info
    const fetchEstimationInfo = useCallback(async () => {
        try {
            const { data } = await fetchEstimationInfoAPI(id);
            console.log(data);
            if (data.success) {
                if (data?.data?.estimatedCost) {
                    setEstimationInfo(data.data);
                    setIsSaved(true);
                }
            } else {
                toast.error(data.status);
                setIsSaved(false);
            }
        } catch (error) {
            console.error('There was an error fetching the property info!', error);
            toast.error('There was an error fetching the property info!');
            setIsSaved(false);
        }
    }, [id]);

    // useEffect to fetch basic info on component mount
    useEffect(() => {
        fetchEstimationInfo();
    }, [id, fetchEstimationInfo]);

    return (
        <div className="px-4 sm:px-10 md:px-14 lg:px-20 mx-auto p-8 rounded">
            <p className='font-semibold text-zinc-500 '>Step 2 out of .</p>
            <h2 className="text-xl sm:text-2xl font-semibold sm:font-bold mb-2 text-black/80">Estimate and Incur</h2>
            <form onSubmit={handleSubmit} className='flex gap-4 h-[40vh] flex-col justify-between'>
                <div className="mb-4">
                    <label className="block">Estimated Cost</label>
                    <input
                        type="number"
                        name="estimatedCost"
                        value={estimationInfo.estimatedCost}
                        onChange={handleChange}
                        className="w-full p-2 border border-zinc-300 rounded mt-1"
                        placeholder="Enter estimated cost"
                        required
                    />
                    <p className='text-green-700 text-sm my-2'>
                        {numberToWords(estimationInfo.estimatedCost)}
                    </p>
                </div>
                <div className="mb-4">
                    <label className="block">Incurred Cost</label>
                    <input
                        type="number"
                        name="incurredCost"
                        value={estimationInfo.incurredCost}
                        onChange={handleChange}
                        className="w-full p-2 border border-zinc-300 rounded mt-1"
                        placeholder="Enter incurred cost"
                        required
                    />
                    <p className='text-green-700 text-sm my-2'>
                        {numberToWords(estimationInfo.incurredCost)}
                    </p>
                </div>
                <div className="flex justify-between items-center col-span-2">
                    <Link
                        to={`/projects/${id}/basic-info`}
                        className={`px-2 sm:px-4 sm:font-semibold py-1.5 rounded-md flex gap-2 items-center justify-center text-sm sm:text-base bg-zinc-300/60 hover:bg-zinc-400/30 text-black `}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z" />
                        </svg>
                        Previous
                    </Link>
                    <div className='flex items-center justify-center gap-4'>
                        <button
                            type="submit"
                            className={`px-2 sm:px-4 sm:font-semibold py-1.5 text-black rounded-md flex gap-2 items-center justify-center text-sm sm:text-base bg-blue-300 `}
                        >
                            {isSaved && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6 ">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                            </svg>}
                            Save
                        </button>
                        <button
                            type="button"
                            disabled={!isSaved}
                            onClick={handleNext}
                            className={`px-2 sm:px-4 sm:font-semibold py-1.5 rounded-md flex gap-2 items-center justify-center text-sm sm:text-base text-black/90 ${isSaved ? 'bg-green-300 hover:bg-green-300' : 'bg-zinc-300'}`}
                        >
                            Next
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EstimationInfo;
