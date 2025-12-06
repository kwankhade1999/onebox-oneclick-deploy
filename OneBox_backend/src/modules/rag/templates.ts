

export const TEMPLATES: ReplyTemplate[] = [
    {
        id: "template_1",
        label: "interested_followup",
        text: `
Hi {{name}}, thanks for showing interest!

I'd love to share more details about how we can help your business.
Let me know your preferred time for a quick call.

Regards,
{{sender}}
`,
    },

    {
        id: "template_2",
        label: "meeting_booked",
        text: `
Hi {{name}}, thanks for booking a meeting!

Here is the confirmation. Let me know if you want to reschedule.
Excited to talk soon!

Regards,
{{sender}}
`,
    },

    {
        id: "template_3",
        label: "not_interested",
        text: `
Hi {{name}}, thanks for the update.

No problem — I'll pause communication for now.
Feel free to reach out anytime in the future.

Regards,
{{sender}}
`,
    },
];
