import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchSiteProgressAPI, siteProgressAPI } from '../../../../utility/api';

const SiteProgress = () => {
    const { id } = useParams(); // Get project ID from URL
    const navigate = useNavigate(); // For navigation
    const [progressInfo, setProgressInfo] = useState({
        internalRoadsFootpaths: '',
        waterSupply: '',
        sewerage: '',
        stormWaterDrains: '',
        landscapingTreePlanting: '',
        streetLighting: '',
        communityBuildings: '',
        sewageTreatment: '',
        solidWasteManagement: '',
        waterConservation: '',
        energyManagement: '',
        fireProtection: '',
        electricalMeterRoom: ''
    });
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value >= 0 && value <= 100) {
            setProgressInfo({ ...progressInfo, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await siteProgressAPI(id, progressInfo);
            if (data.success) {
                toast.success(data.status);
                setIsSaved(true);
            } else {
                toast.error(data.status);
                setIsSaved(false);
            }
        } catch (error) {
            console.error('There was an error saving the site progress info!', error);
            setIsSaved(false);
        }
    };

    const fetchProgressInfo = useCallback(async () => {
        try {
            const { data } = await fetchSiteProgressAPI(id);
            if (data.success) {
                if (data?.data?.internalRoadsFootpaths) {
                    setProgressInfo(data.data);
                    setIsSaved(true);
                }
            } else {
                toast.error(data.status);
                setIsSaved(false);
            }
        } catch (error) {
            console.error('There was an error fetching the site progress info!', error);
            toast.error('There was an error fetching the site progress info!');
            setIsSaved(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProgressInfo();
    }, [id, fetchProgressInfo]);

    const handleNext = () => {
        navigate(`/projects/${id}/units`);
    };


    return (
        <div className="px-4 sm:px-10 md:px-14 lg:px-20 mx-auto p-8 rounded">
            <p className='font-semibold text-zinc-500 '>Step 2 out of 4.</p>
            <h2 className="text-xl sm:text-2xl font-semibold sm:font-bold mb-6 text-black/80">Site Progress</h2>
            <form onSubmit={handleSubmit} className='flex flex-col gap'>
                {[
                    { label: 'Internal Roads & Footpaths', name: 'internalRoadsFootpaths' },
                    { label: 'Water Supply', name: 'waterSupply' },
                    { label: 'Sewerage (chamber, lines, Septic Tank, STP)', name: 'sewerage' },
                    { label: 'Storm Water Drains', name: 'stormWaterDrains' },
                    { label: 'Landscaping & Tree Planting', name: 'landscapingTreePlanting' },
                    { label: 'Street Lighting', name: 'streetLighting' },
                    { label: 'Community Buildings', name: 'communityBuildings' },
                    { label: 'Treatment and disposal of sewage and sullage water', name: 'sewageTreatment' },
                    { label: 'Solid Waste Management & Disposal', name: 'solidWasteManagement' },
                    { label: 'Water Conservation, Rainwater Harvesting', name: 'waterConservation' },
                    { label: 'Energy Management', name: 'energyManagement' },
                    { label: 'Fire Protection and Fire Safety Requirements', name: 'fireProtection' },
                    { label: 'Electrical Meter Room, Sub-station, Receiving Station', name: 'electricalMeterRoom' }
                ].map(({ label, name }, index) => (
                    <div key={name} className="mb-4 flex justify-between items-center p-4 bg-zinc-300/40 rounded-lg font-medium">
                        <div className='flex items-center justify-center gap-4'>
                            <label>{index + 1}</label>
                            <label className="block">{label}</label>
                        </div>
                        <div className='w-96 flex items-center justify-center gap-4'>
                            <input
                                type="range"
                                name={name}
                                id={label}
                                value={progressInfo[name]}
                                onChange={handleChange}
                                className="rounded h-10 w-[80%] text-green-300"
                                min="0"
                                max="100"
                                step="5"
                                required
                            />
                            <div className='flex items-center justify-center gap-2'>
                                <input
                                    type="number"
                                    name={name}
                                    id={label}
                                    value={progressInfo[name]}
                                    onChange={handleChange}
                                    className="p-2 rounded mt-1 text-black bg-zinc-400/20"
                                    min="0"
                                    max="100"
                                    required
                                />
                                <label className='text-lg text-black/80' htmlFor={label}>%</label>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="flex justify-between items-center col-span-2">
                    <Link
                        to={`/projects/${id}/previous-step`}
                        className="px-2 sm:px-4 sm:font-semibold py-1.5 rounded-md flex gap-2 items-center justify-center text-sm sm:text-base bg-zinc-300/40 text-black hover:bg-zinc-300/80"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z" />
                        </svg>
                        Previous
                    </Link>
                    <div className="flex justify-between items-center col-span-2 gap-2">
                        <button
                            type="submit"
                            className={`px-2 sm:px-4 sm:font-semibold py-1.5 rounded-md flex gap-2 items-center justify-center text-sm sm:text-base bg-blue-300 text-black/90`}
                            disabled={!isSaved}
                        >
                            {isSaved && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            }
                            {isSaved ? 'Saved' : 'Save'}
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="px-2 sm:px-4 bg-green-600 py-1.5 sm:font-semibold rounded-md text-sm sm:text-base flex items-center justify-center gap-2"
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

export default SiteProgress;
