import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { paymentService } from "../services/paymentService";

export default function PaymentSuccess() {

    const navigate = useNavigate();

    useEffect(() => {

        const paymentId =
            localStorage.getItem("payos_payment_id");

        if (paymentId) {
            paymentService.payosSuccess(paymentId);
            localStorage.removeItem("payos_payment_id");
        }

        navigate("/dashboard");

    }, []);

    return null;
}