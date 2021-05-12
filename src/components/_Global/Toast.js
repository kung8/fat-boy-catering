import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default (
    <ToastContainer
        position="bottom-center"
        hideProgressBar={true}
        closeOnClick={true}
        autoClose={500}
        transition={Flip}
        draggable={true}
        draggablePercent={80}
    />
)