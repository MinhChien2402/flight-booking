import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const downloadReservationPdf = createAsyncThunk(
    "pdf/downloadReservationPdf", // Đổi từ downloadBookingPdf
    async (reservationId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
            }
            const response = await axiosInstance.get(`/Reservation/${reservationId}/pdf`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob", // Đảm bảo trả về binary data cho file PDF
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `reservation_${reservationId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url); // Dọn dẹp URL
            return { success: true, reservationId }; // Trả về thông tin thành công
        } catch (error) {
            console.error("API Error:", error.message, error.response?.data);
            if (error.response?.status === 404) {
                return rejectWithValue("Không tìm thấy file PDF. Vui lòng kiểm tra reservation ID.");
            } else if (error.response?.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return rejectWithValue("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            }
            return rejectWithValue(
                error.response?.data?.message || "Lỗi khi tải PDF"
            );
        }
    }
);