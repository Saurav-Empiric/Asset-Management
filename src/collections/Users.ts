import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      label: "User Name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email id",
      type: "email",
      required: true,
    },
    {
      name: "assignedPeripherals",
      type: "array",
      maxRows: 1,
      required: false,
      fields: [
        {
          name: "peripheral",
          type: "relationship",
          relationTo: "peripherals",
          // filterOptions: ({}) => {
          //   return {
          //     assignedTo: { exists: false }
          //   }
          // },
          hasMany: true,
          required: true,
        },
        {
          name: "peripheralDetails",
          type: "json",
          admin: {
            readOnly: true, // Prevent manual editing
          },
        },
      ],
    },
  ],
  hooks: {

    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // Prevent infinite loops
        if (req.context.skipAfterChangeHook) {
          return;
        }

        // Extract current and previous peripheral IDs
        const currentPeripheralIDs = doc.assignedPeripherals?.[0]?.peripheral || [];
        const previousPeripheralIDs = previousDoc.assignedPeripherals?.[0]?.peripheral || [];

      

        // Determine added and removed peripherals
        const addedPeripheralIDs = currentPeripheralIDs.filter(
          (id: any) => !previousPeripheralIDs.includes(id)
        );
        const removedPeripheralIDs = previousPeripheralIDs.filter(
          (id: any) => !currentPeripheralIDs.includes(id)
        );

        // Update each added peripheral
        for (const peripheralID of addedPeripheralIDs) {
          await req.payload.update({
            collection: 'peripherals',
            id: peripheralID,
            data: {
              assignedTo: doc.id,
            },
            overrideAccess: true,
            req: {
              ...req,
              context: {
                ...req.context,
                skipAfterChangeHook: true,
              },
            },
          });
        }

        // Update each removed peripheral
        for (const peripheralID of removedPeripheralIDs) {
          await req.payload.update({
            collection: 'peripherals',
            id: peripheralID,
            data: {
              assignedTo: null,
            },
            overrideAccess: true,
            req: {
              ...req,
              context: {
                ...req.context,
                skipAfterChangeHook: true,
              },
            },
          });
        }


        // Show the peripherals details
        const peripheralDetailsMap = doc?.assignedPeripherals?.[0]?.peripheralDetails || {};

        for (const item of currentPeripheralIDs) {
          const peripheral = await req.payload.findByID({
            collection: "peripherals",
            id: item,
          });

          // Add or update the peripheral details in the map
          peripheralDetailsMap[item] = { name: peripheral.name, id: peripheral.id };
          console.log("peripheraldetails::::    ", peripheral);

          // Update the `peripheralDetails` field
          await req.payload.update({
            collection: "users",
            id: doc.id,
            data: {
              assignedPeripherals: [
                {
                  ...doc.assignedPeripherals[0],
                  peripheralDetails: peripheralDetailsMap, // Save as JSON string
                },
              ],
            },
            overrideAccess: true,
            req: {
              ...req,
              context: {
                ...req.context,
                skipAfterChangeHook: true, // Prevent infinite loops
              },
            },
          });
        }
      },
    ],

  },
};
