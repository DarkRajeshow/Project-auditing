import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { fetchUnitsAPI, unitsAPI } from '../../../../utility/api';
import { Link, useNavigate, useParams } from 'react-router-dom';

const UnitTable = () => {
    const { id } = useParams(); // Get project ID from URL
    const navigate = useNavigate(); // For navigation
    const [units, setUnits] = useState([]);
    const [editedUnits, setEditedUnits] = useState({});
    const [isSaved, setIsSaved] = useState(false);


    const handleComplete = () => {
        navigate(`/`);
    };

    const fetchUnitTable = useCallback(async () => {
        try {
            const { data } = await fetchUnitsAPI(id);
            console.log(data);
            if (data.success) {
                if (data?.data[0].agreementDate) {
                    setUnits(data.data);
                    setIsSaved(true)
                }
            } else {
                toast.error(data.status);
            }
        } catch (error) {
            console.error('There was an error fetching the basic info!', error);
        }
    }, [id]);


    useEffect(() => {
        fetchUnitTable();
    }, [id, fetchUnitTable]);


    const handleChange = (e, index, field) => {
        const newUnits = [...units];
        newUnits[index][field] = e.target.value;
        setUnits(newUnits);

        const edited = { ...editedUnits };
        edited[index] = { ...edited[index], [field]: e.target.value };
        setEditedUnits(edited);

    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const { data } = await unitsAPI(id, units);
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

    return (
        <div className="min-h-[80vh] flex items-center justify-between flex-col p-10">
            <table className="">
                <thead>
                    <tr className='bg-zinc-300/80 text-black/90'>
                        <th className="">Unit Name</th>
                        <th className="">Carpet Area</th>
                        <th className="">Status</th>
                        <th className="">Agreement Date</th>
                        <th className="">Agreement Value</th>
                        <th className="">Buyer Name</th>
                        <th className="">Advance 2020-21</th>
                        <th className="">Advance 2021-22</th>
                        <th className="">Advance 2022-23</th>
                        <th className="">Advance 2023-24</th>
                        <th className="">Total Received</th>
                        <th className="">Balance</th>
                    </tr>
                </thead>
                <tbody className='bg-zinc-300/40 text-black/90'>
                    {units.map((unit, index) => (
                        <tr key={index}>
                            <td className="">{unit.unitName}</td>
                            <td className="">
                                <input className='text-center'
                                    type="number" value={unit.carpetArea || ''} onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
                                            const newUnits = [...units];
                                            newUnits[index]['carpetArea'] = e.target.value;
                                            setUnits(newUnits);
                                        }
                                    }} />
                            </td>
                            <td className="">
                                <select value={unit.status || ''} onChange={(e) => handleChange(e, index, 'status')}>
                                    <option value="Sold">Sold</option>
                                    <option value="Unsold">Unsold</option>
                                    <option value="Booked">Booked</option>
                                </select>
                            </td>
                            <td className="">
                                <input className='text-center' type="date" value={formatDate(unit.agreementDate)} onChange={(e) => handleChange(e, index, 'agreementDate')} />
                            </td>
                            <td className="">
                                <input className='text-center' type="number" value={unit.agreementValue || ''} onChange={(e) => handleChange(e, index, 'agreementValue')} />
                            </td>
                            <td className="">
                                <input className='text-center' type="text" value={unit.buyerName || ''} onChange={(e) => handleChange(e, index, 'buyerName')} />
                            </td>
                            <td className="">
                                <input className='text-center' type="number" value={unit.advanceReceived_2020_2021 || ''} onChange={(e) => handleChange(e, index, 'advanceReceived_2020_2021')} />
                            </td>
                            <td className="">
                                <input className='text-center' type="number" value={unit.advanceReceived_2021_2022 || ''} onChange={(e) => handleChange(e, index, 'advanceReceived_2021_2022')} />
                            </td>
                            <td className="">
                                <input className='text-center' type="number" value={unit.advanceReceived_2022_2023 || ''} onChange={(e) => handleChange(e, index, 'advanceReceived_2022_2023')} />
                            </td>
                            <td className="">
                                <input className='text-center' type="number" value={unit.advanceReceived_2023_2024 || ''} onChange={(e) => handleChange(e, index, 'advanceReceived_2023_2024')} />
                            </td>
                            <td className="">{Number(unit.advanceReceived_2020_2021) + Number(unit.advanceReceived_2021_2022) + Number(unit.advanceReceived_2022_2023) + Number(unit.advanceReceived_2023_2024)}</td>
                            <td className="">{unit.agreementValue && Number(unit.agreementValue) - (Number(unit.advanceReceived_2020_2021) + Number(unit.advanceReceived_2021_2022) + Number(unit.advanceReceived_2022_2023) + Number(unit.advanceReceived_2023_2024))}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='flex items-center justify-between w-full '>
                <Link
                    to={`/projects/${id}/site-progress`}
                    className="px-2 sm:px-4 sm:font-semibold py-1.5 rounded-md flex gap-2 items-center justify-center text-sm sm:text-base bg-zinc-300/40 text-black hover:bg-zinc-300/80"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z" />
                    </svg>
                    Previous
                </Link>
                <div className='gap-4 sm:w-60 flex items-center justify-center'>
                    <button
                        type="submit"
                        className={`px-2 sm:px-4 sm:font-semibold py-1.5 rounded-md flex gap-2 items-center justify-center text-sm sm:text-base text-black/80 bg-green-300`}
                        onClick={handleSave}
                    >
                        {isSaved && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        }
                        {isSaved ? 'Saved' : 'Save'}
                    </button>
                    <button
                        type="button"
                        onClick={handleComplete}
                        disabled={!isSaved}
                        className={`flex items-center justify-center gap-1.5 px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base w-full text-black/80 rounded sm:font-semibold ${isSaved ? 'bg-blue-300' : 'bg-zinc-300'}`}
                    >
                        Complete

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                        </svg>

                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnitTable;
