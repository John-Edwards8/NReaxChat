import { useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import AddRoomModal from "../../modals/AddRoomModal";

const AddRoom = () => {
    const [isOpen, setIsOpen] = useState(false);

    return(
        <>
            <div className="flex items-center gap-3 px-4 cursor-pointer" onClick={() => setIsOpen(true)}>
                <IoMdAddCircleOutline className="w-16 h-16 text-blue-base" />
                <span className="text-2xl font-semibold">New Room</span>
            </div>
            <AddRoomModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default AddRoom;