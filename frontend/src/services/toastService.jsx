import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (message, type = 'success') => {
    if (type === 'success') {
        toast.success(message);
    } else {
        toast.error(message);
    }
};
