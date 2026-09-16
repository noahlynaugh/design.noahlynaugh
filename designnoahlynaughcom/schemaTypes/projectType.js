import {defineField, defineType} from 'sanity'
import {VideoPosterInput} from './VideoPosterInput'

export const projectType = defineType({
    name: 'project',
    title: 'project',
    type: 'document',
    fields: [
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description: 'URL/id for this project. Must match the project="..." attribute on the site card + project page.',
            options: { source: 'name', maxLength: 96 },
            validation: (Rule) => Rule.required(),
        },
        {
            // Single hero asset (image OR video) shared by the home card and the
            // project lander. Length-1 array union so the editor picks one type.
            name: 'media',
            title: 'Hero media (image or video)',
            type: 'array',
            description: 'The hero shown on the home card AND at the top of the project page (drives the zoom transition). Pick ONE image or one video.',
            of: [
                {
                    type: 'image',
                    title: 'Image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'brightness',
                            title: 'Light background?',
                            type: 'boolean',
                            description: 'ON = light image, use dark caption text. OFF = dark image, use light caption text.',
                        },
                    ],
                },
                {
                    type: 'file',
                    title: 'Video',
                    options: { accept: 'video/mp4' },
                    fields: [
                        {
                            name: 'brightness',
                            title: 'Light background?',
                            type: 'boolean',
                            description: 'ON = light footage, use dark caption text. OFF = dark footage, use light caption text.',
                        },
                    ],
                },
            ],
            validation: (Rule) => Rule.max(1),
        },
        {
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [
                {
                type: 'image',
                title: 'Upload Image',
                fields: [
                    {
                    name: 'name',
                    title: 'Image Name',
                    type: 'string',
                    }
                ],

                preview: {
                    select: {
                    title: 'name',
                    media: 'asset',
                    },
                    prepare({title, media}) {
                    return {
                        title: title || 'Uploaded Image',
                        media,
                    }
                    }
                }
                },
                {
                type: 'object',
                name: 'imageUrlObject',
                title: 'Image URL',
                fields: [
                    {
                    name: 'url',
                    title: 'Image URL',
                    type: 'url',
                    validation: Rule => Rule.uri({scheme: ['http', 'https']}),
                    },
                    {
                    name: 'name',
                    title: 'Image Name',
                    type: 'string',
                    }
                ],
                preview: {
                    select: {
                    url: 'url',
                    name: 'name',
                    },
                    prepare({url, name}) {
                    return {
                        title: name || url || 'No name',
                        media: url ? ImageUrlPreview({url, name}) : undefined,
                    }
                    }
                }
                }
            ]
        },
        {
        // LEGACY hero — superseded by the `media` union field above.
        // Kept for backward-compat; migrate content into `media`, then Noah can remove.
        name: 'video',
        title: 'Video (legacy — use "Hero media" above)',
        type: 'object',
        components: { input: VideoPosterInput },
        fields: [
            { name: 'file',   title: 'Video file', type: 'file',  options: { accept: 'video/mp4' } },
            { name: 'poster', title: 'Poster',     type: 'image', options: { hotspot: true } },
        ],
        }
    ],
})