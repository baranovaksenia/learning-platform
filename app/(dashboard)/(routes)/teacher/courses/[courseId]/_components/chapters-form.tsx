'use client'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Chapter, Course } from '@prisma/client'
import axios from 'axios'
import { PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

interface ChaptersFormProps {
	initialData: Course & { chapters: Chapter[] }
	courseId: string
}

const formSchema = z.object({
	title: z.string().nonempty({ message: 'Title is required' }),
})

const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
	const router = useRouter()
	const [isCreating, setIsCreating] = useState(false)
	const [isUpdating, setIsUpdating] = useState(false)

	const toggleCreating = () => {
		setIsCreating(current => !current)
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
		},
	})

	const { isSubmitting, isValid } = form.formState

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post(`/api/courses/${courseId}/chapters`, values)
			toast.success('Chapter created')
			toggleCreating()
			router.refresh()
		} catch (error) {
			toast.error('Something went wrong')
		}
	}

	return (
		<div className='mt-6 border bg-slate-100 rounded-md p-4'>
			<div className='font-medium flex items-center justify-between'>
				Course chapters
				<Button variant='ghost' onClick={toggleCreating}>
					{isCreating ? (
						<>Cancel</>
					) : (
						<>
							<PlusCircle className='h-4 w-4 mr-2' />
							Add a chapter
						</>
					)}
				</Button>
			</div>

			{isCreating && (
				<Form {...form}>
					<form
						className='space-y-4 mt-4'
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											disabled={isSubmitting}
											{...field}
											placeholder="e.g. 'Introduction to the course'"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex items-center gap-x-2'>
							<Button
								className=''
								type='submit'
								disabled={!isValid || isSubmitting}
							>
								Create
							</Button>
						</div>
					</form>
				</Form>
			)}
			{!isCreating && (
				<div
					className={cn(
						'text-sm mt-2',
						!initialData.chapters.length && 'text-slate-500 italic'
					)}
				>
					{!initialData.chapters.length && 'No chapters yet'}
					{/* TODO: Add list of chapters */}
				</div>
			)}
			{!isCreating && (
				<p className='text-xs text-muted-foreground mt-4'>
					Drag and drop to reorder the chapters
				</p>
			)}
		</div>
	)
}

export default ChaptersForm
