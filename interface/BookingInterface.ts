export interface BookingInterface {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerCardId: string;
    customerGender: string;
    status?: string;
    stayAt: Date;
    stayUntil?: Date;
    deposit: number;
    remark?: string;
    roomId: string;
}