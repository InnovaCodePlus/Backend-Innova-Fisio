/*
  Warnings:

  - The values [Aprovado] on the enum `AppointmentRequestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AppointmentRequestStatus_new" AS ENUM ('Pendiente', 'Aprobado', 'Rechazado');
ALTER TABLE "public"."appointment_requests" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "appointment_requests" ALTER COLUMN "status" TYPE "AppointmentRequestStatus_new" USING ("status"::text::"AppointmentRequestStatus_new");
ALTER TYPE "AppointmentRequestStatus" RENAME TO "AppointmentRequestStatus_old";
ALTER TYPE "AppointmentRequestStatus_new" RENAME TO "AppointmentRequestStatus";
DROP TYPE "public"."AppointmentRequestStatus_old";
ALTER TABLE "appointment_requests" ALTER COLUMN "status" SET DEFAULT 'Pendiente';
COMMIT;
