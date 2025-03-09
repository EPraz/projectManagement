import * as yup from "yup";

export const teamMemberCapacitySchema = yup.object({
  userId: yup.string().required("User is required"),
  capacity: yup
    .number()
    .required("Capacity is required")
    .min(1, "Capacity must be at least 1"),
  daysOff: yup
    .number()
    .required("Days Off is required")
    .min(0, "Days Off must be at least 0"),
  remainingWork: yup
    .number()
    .required("Remaining Work is required")
    .min(0, "Remaining Work must be at least 0")
    .test(
      "remaining-work",
      "Remaining work must be less than or equal to capacity",
      function (value) {
        const { capacity } = this.parent;
        return value <= capacity;
      }
    ),
});
