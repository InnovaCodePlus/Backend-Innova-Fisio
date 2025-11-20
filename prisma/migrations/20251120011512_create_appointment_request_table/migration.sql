-- CreateEnum
CREATE TYPE "AppointmentRequestStatus" AS ENUM ('Pendiente', 'Aprovado', 'Rechazado');

-- CreateTable
CREATE TABLE "appointment_requests" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "status" "AppointmentRequestStatus" NOT NULL DEFAULT 'Pendiente',
    "customerId" TEXT NOT NULL,

    CONSTRAINT "appointment_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "appointment_requests" ADD CONSTRAINT "appointment_requests_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
