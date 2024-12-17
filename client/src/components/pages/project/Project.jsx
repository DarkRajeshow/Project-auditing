import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProjectByIdAPI } from '../../../utility/api';
import { toast } from 'sonner';
import SmartLoader from '../../reusable/SmartLoader';

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    // const formatDate = (dateString) => {
    //     const date = new Date(dateString);
    //     const year = date.getFullYear();
    //     const month = String(date.getMonth() + 1).padStart(2, '0');
    //     const day = String(date.getDate()).padStart(2, '0');
    //     return `${year}-${month}-${day}`;
    // };


    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const { data } = await fetchProjectByIdAPI(id);
                if (data.success) {
                    setProject(data.project);
                    console.log(data);
                }
                else {
                    toast.error(data.status);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            }
            setLoading(false);
        };
        fetchProject();
    }, [id]);

    const renderTable = (attributes) => {
        return (
            <table className="w-full table-auto mb-4 border-collapse overflow-hidden">
                <thead>
                    <tr className="bg-zinc-300/60 text-black info">
                        <th className="border px-4 py-2  text-left">Sr No</th>
                        <th className="border px-4 py-2  text-left">Attribute Name</th>
                        <th className="border px-4 py-2  text-left">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {attributes.map((attribute, index) => (
                        <tr key={index} className={'bg-zinc-300/40 text-black info'}>
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{attribute.name}</td>
                            <td className="border px-4 py-2">{attribute.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderUnitsTable = (units) => {
        return (
            <table className="w-full table-auto mb-4 border-collapse overflow-hidden">
                <thead>
                    <tr className="bg-zinc-300/40 info text-black">
                        <th className="border px-4 py-2  text-left">Sr No</th>
                        <th className="border px-4 py-2  text-left">Unit Name</th>
                        <th className="border px-4 py-2  text-left">Carpet Area</th>
                        <th className="border px-4 py-2  text-left">Status</th>
                        <th className="border px-4 py-2  text-left">Agreement Date</th>
                        <th className="border px-4 py-2  text-left">Agreement Value</th>
                        <th className="border px-4 py-2  text-left">Buyer Name</th>
                        <th className="border px-4 py-2  text-left">Total Received</th>
                        <th className="border px-4 py-2  text-left">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {units.map((unit, index) => (
                        <tr key={index} className={'bg-zinc-300/40 info text-black'}>
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{unit.unitName}</td>
                            <td className="border px-4 py-2">{unit.carpetArea}</td>
                            <td className="border px-4 py-2">{unit.status}</td>
                            <td className="border px-4 py-2">{new Date(unit.agreementDate).toLocaleDateString()}</td>
                            <td className="border px-4 py-2">{unit.agreementValue}</td>
                            <td className="border px-4 py-2">{unit.buyerName}</td>
                            <td className="border px-4 py-2">{unit.totalReceived}</td>
                            <td className="border px-4 py-2">{unit.balance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="container mx-auto p-4 capitalize">
            {loading && <SmartLoader />}
            {!loading && <>
                <h1 className="text-xl text-violet-200 sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 mt-4">{project.basicInfo.clientName}</h1>
                <section className="mb-12">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Basic Information</h2>
                    {renderTable([
                        { name: 'Client Name', value: project.basicInfo.clientName },
                        { name: 'Project Name', value: project.basicInfo.projectName },
                        { name: 'Contact No', value: project.basicInfo.contactNo },
                        { name: 'Maharera No', value: project.basicInfo.mahareraNo },
                        { name: 'Registration Date', value: new Date(project.basicInfo.registrationDate).toLocaleDateString() },
                        { name: 'Expiry Date', value: new Date(project.basicInfo.expiryDate).toLocaleDateString() },
                    ])}
                    <Link to={`/projects/${id}/basic-info`} className="updateButton">Update Basic Info</Link>
                </section>

                <section className="mb-12">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Estimation Information</h2>
                    {renderTable([
                        { name: 'Estimated Cost', value: project.estimationInfo.estimatedCost },
                        { name: 'Incurred Cost', value: project.estimationInfo.incurredCost },
                    ])}
                    <Link to={`/projects/${id}/estimation-info`} className="updateButton">Update Estimation Info</Link>
                </section>

                <section className="mb-12">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Site Progress</h2>
                    {renderTable([
                        { name: 'Internal Roads Footpaths', value: project.siteProgress.internalRoadsFootpaths },
                        { name: 'Water Supply', value: project.siteProgress.waterSupply },
                        { name: 'Sewerage', value: project.siteProgress.sewerage },
                        { name: 'Storm Water Drains', value: project.siteProgress.stormWaterDrains },
                        { name: 'Landscaping Tree Planting', value: project.siteProgress.landscapingTreePlanting },
                        { name: 'Street Lighting', value: project.siteProgress.streetLighting },
                        { name: 'Community Buildings', value: project.siteProgress.communityBuildings },
                        { name: 'Sewage Treatment', value: project.siteProgress.sewageTreatment },
                        { name: 'Solid Waste Management', value: project.siteProgress.solidWasteManagement },
                        { name: 'Water Conservation', value: project.siteProgress.waterConservation },
                        { name: 'Energy Management', value: project.siteProgress.energyManagement },
                        { name: 'Fire Protection', value: project.siteProgress.fireProtection },
                        { name: 'Electrical Meter Room', value: project.siteProgress.electricalMeterRoom },
                    ])}
                    <Link to={`/projects/${id}/site-progress`} className="updateButton">Update Site Progress</Link>
                </section>

                <section className="mb-12">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Units</h2>
                    {renderUnitsTable(project.basicInfo.units)}
                </section>

            </>}
        </div>
    );
};

export default ProjectDetails;
