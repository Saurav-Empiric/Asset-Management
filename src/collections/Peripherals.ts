import type { CollectionConfig } from 'payload';

export const Peripherals: CollectionConfig = {
  slug: 'peripherals',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      label: 'Peripheral Name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'licence',
      type: 'array',
      fields: [
        {
          name: 'licenceType',
          label: 'Licence Type',
          type: 'text',
          required: true,
        },
        {
          name: 'expiry',
          label: 'Expiry Date',
          type: 'date',
        },
      ],
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      required: false,
    },
  ],
  // hooks: {
  //   afterChange: [
  //     async ({ doc, previousDoc, req }) => {
  //       // Prevent infinite loops
  //       if (req.context.skipAfterChangeHook) {
  //         return;
  //       }

  //       const newUserID = doc.assignedTo;
  //       const previousUserID = previousDoc.assignedTo;

  //       // If the assigned user has changed
  //       if (newUserID !== previousUserID) {
  //         // Remove this peripheral from the previous user's assignedPeripherals
  //         if (previousUserID) {
  //           const previousUser = await req.payload.findByID({
  //             collection: 'users',
  //             id: previousUserID,
  //             overrideAccess: true,
  //           });
  //           const updatedPeripherals = previousUser.assignedPeripherals?.[0]?.peripheral.filter(
  //             (id: any) => id !== doc.id
  //           );
  //           await req.payload.update({
  //             collection: 'users',
  //             id: previousUserID,
  //             data: {
  //               assignedPeripherals:[{ peripheral: updatedPeripherals }],
  //             },
  //             overrideAccess: true,
  //             req: {
  //               ...req,
  //               context: {
  //                 ...req.context,
  //                 skipAfterChangeHook: true,
  //               },
  //             },
  //           });
  //         }

  //         // Add this peripheral to the new user's assignedPeripherals
  //         if (newUserID) {
  //           const newUser = await req.payload.findByID({
  //             collection: 'users',
  //             id: newUserID,
  //             overrideAccess: true,
  //           });
  //           const updatedPeripherals = [
  //             ...(newUser.assignedPeripherals?.[0]?.peripheral || []),
  //             doc.id,
  //           ];
  //           await req.payload.update({
  //             collection: 'users',
  //             id: newUserID,
  //             data: {
  //               assignedPeripherals:[{ peripheral: updatedPeripherals}],
  //             },
  //             overrideAccess: true,
  //             req: {
  //               ...req,
  //               context: {
  //                 ...req.context,
  //                 skipAfterChangeHook: true,
  //               },
  //             },
  //           });
  //         }
  //       }
  //     },
  //   ],
  // },
};
