

function Modal({ isVisible, onClose, children }: { isVisible: boolean, onClose: () => void, children: React.ReactNode }) {
    if (!isVisible) {
        return null
    }
    return <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center overflow-auto ">
        <dialog className={`w-[600px] flex flex-col rounded-lg overflow-auto animate-one-bounce`}>
            <button className="text-white text-xl place-self-end bg-transparent" onClick={onClose}>X</button>
            <div className=" p-2 rounded ">
                {children}
            </div>
        </dialog>

    </div>
}

export default Modal