-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('Pendiente', 'Cancelado', 'Finalizado');

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'Pendiente';
