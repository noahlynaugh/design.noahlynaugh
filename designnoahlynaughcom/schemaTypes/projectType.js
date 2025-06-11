import {defineField, defineType} from 'sanity'

export const projectType = defineType({
    name: 'project',
    title: 'project',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            type: 'string',
        }),
    ],
})