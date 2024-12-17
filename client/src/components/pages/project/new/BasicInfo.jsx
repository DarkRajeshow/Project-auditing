import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { basicInfoAPI, fetchBasicInfoAPI, fetchProjectsAPI } from '../../../../utility/api';
import { toast } from 'sonner';

const BasicInfoForm = () => {
    const { id } = useParams(); // Get project ID from URL
    const navigate = useNavigate(); // For navigation
    const [validationError, setValidationError] = useState(false);

    const [projects, setProjects] = useState([]);
    const [basicInfo, setBasicInfo] = useState({
        clientName: '',
        projectName: '',
        contactNo: '',
        mahareraNo: '',
        registrationDate: '',
        expiryDate: '',
        units: ''
    });
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo({ ...basicInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedBasicInfo = {
                ...basicInfo,
                units: basicInfo.units.split(" ").join("").split(",")
            }
            const { data } = await basicInfoAPI(id, updatedBasicInfo);
            if (data.success) {
                toast.success(data.status);
                setIsSaved(true);
            }
            else {
                toast.error(data.status);
                setIsSaved(false);
            }
        } catch (error) {
            console.error('There was an error saving the basic info!', error);
            setIsSaved(false);
        }
    };

    const handleNext = () => {
        navigate(`/projects/${id}/estimation-info`);
    };


    useEffect(() => {
        const getProjects = async () => {
            try {
                const { data } = await fetchProjectsAPI();
                console.log(data);
                if (data.success) {
                    setProjects(data.projects);
                }
            } catch (err) {
                console.log(err);
            }
        };

        getProjects();
    }, []);

    // Function to fetch basic info
    const fetchBasicInfo = useCallback(async () => {
        try {
            const { data } = await fetchBasicInfoAPI(id);
            if (data.success) {
                if (data?.data?.clientName) {
                    setBasicInfo(data.data);
                    setIsSaved(true);
                }
            } else {
                toast.error(data.status);
                setIsSaved(false);
            }
        } catch (error) {
            console.error('There was an error fetching the basic info!', error);
            setIsSaved(false);
        }
    }, [id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const isProjectNameUnique = useCallback((newName) => {
        if (projects) {
            return !projects.some(project => {
                if (project.basicInfo) {
                    return project.basicInfo.projectName === newName && id !== project._id;
                }
            });
        }
        return true;
    }, [projects, id])



    // useEffect to fetch basic info on component mount
    useEffect(() => {
        fetchBasicInfo();
    }, [id, fetchBasicInfo]);

    useEffect(() => {
        if (!isProjectNameUnique(basicInfo.projectName)) {
            setValidationError(true);
        }
        else {
            setValidationError(false);
        }
    }, [basicInfo.projectName, isProjectNameUnique])


    const units = typeof basicInfo.units !== "string" ? basicInfo.units.map((unit) => unit.unitName) : basicInfo.units;
    return (
        <div className="px-4 sm:px-10 md:px-14 lg:px-20 mx-auto p-8 rounded">
            <p className='sm:font-semibold text-zinc-600 '>Step 1 out of 4.</p>
            <h2 className="text-xl sm:text-2xl font-semibold sm:font-bold mb-2 text-black/80">Basic Information</h2>
            <form onSubmit={handleSubmit} className="sm:grid sm:grid-cols-2 gap-4">
                <div>
                    <div className="mb-4">
                        <label className="block">Client Name</label>
                        <input
                            type="text"
                            name="clientName"
                            value={basicInfo.clientName}
                            onChange={handleChange}
                            className="w-full p-2 border border-zinc-300 rounded mt-1"
                            placeholder="Enter client name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Project Name</label>
                        {validationError && <p className='my-1 text-red-400'>{`The title '${basicInfo.projectName}' is already taken by your earlier projects.`}</p>}
                        <input
                            type="text"
                            name="projectName"
                            value={basicInfo.projectName}
                            onChange={handleChange}
                            className="w-full p-2 border border-zinc-300 rounded mt-1"
                            placeholder="Enter project name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Contact Number</label>
                        <input
                            type="text"
                            name="contactNo"
                            value={basicInfo.contactNo}
                            onChange={handleChange}
                            className="w-full p-2 border border-zinc-300 rounded mt-1"
                            placeholder="Enter contact number"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">MahaRERA Number</label>
                        <input
                            type="text"
                            name="mahareraNo"
                            value={basicInfo.mahareraNo}
                            onChange={handleChange}
                            className="w-full p-2 border border-zinc-300 rounded mt-1"
                            placeholder="Enter MahaRERA number"
                            required
                        />
                    </div>
                </div>
                <div>
                    <div className="mb-4">
                        <label className="block">Registration Date</label>
                        <input
                            type="date"
                            name="registrationDate"
                            value={formatDate(basicInfo.registrationDate)}
                            onChange={handleChange}
                            className="w-full p-2 border border-zinc-300 rounded mt-1"
                            placeholder="Enter registration date"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Expiry Date</label>
                        <input
                            type="date"
                            name="expiryDate"
                            value={formatDate(basicInfo.expiryDate)}
                            onChange={handleChange}
                            className="w-full p-2 border border-zinc-300 rounded mt-1"
                            placeholder="Enter expiry date"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Units</label>
                        <input
                            type="text"
                            name="units"
                            disabled={isSaved}
                            value={units}
                            className={`w-full p-2 border border-zinc-300 rounded mt-1 ${isSaved && 'text-zinc-500'}`}
                            placeholder="Enter units (comma-separated)"
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center col-span-2">
                    <button
                        type="submit"
                        className={`px-2 sm:px-4 sm:font-semibold py-1.5 rounded-md flex gap-2 items-center justify-center text-sm sm:text-base text-black/80 ${validationError ? 'bg-zinc-600' : ' bg-green-300'}`}
                        disabled={validationError}
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
                        className="px-2 sm:px-4 bg-blue-300 py-1.5 sm:font-semibold rounded-md text-sm text-black/80 sm:text-base"
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BasicInfoForm;
