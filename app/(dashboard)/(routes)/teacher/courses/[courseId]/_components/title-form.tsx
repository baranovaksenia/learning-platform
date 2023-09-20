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
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

interface TitleFormProps {
	initialData: {
		title: string
	}
	courseId: string
}

const formSchema = z.object({
	title: z.string().nonempty({ message: 'Title is required' }),
})

const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false)

	const toggleEdit = () => {
		setIsEditing(prev => !prev)
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData,
	})

	const { isSubmitting, isValid } = form.formState

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/courses/${courseId}`, values)
			toast.success('Course title updated')
			toggleEdit()
			router.refresh()
		} catch (error) {
			toast.error('Something went wrong')
		}
	}

	return (
		<div className='mt-6 border bg-slate-100 rounded-md p-4'>
			<div className='font-medium flex items-center justify-between'>
				Course title
				<Button variant='ghost' onClick={toggleEdit}>
					{isEditing && <>Cancel</>}
					{!isEditing && (
						<>
							<Pencil className='h-4 w-4 mr-2' />
							Edit Title
						</>
					)}
				</Button>
			</div>

			{!isEditing && <p className='text-sm mt-2'>{initialData.title}</p>}
			{isEditing && (
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
											placeholder="e.g. 'Introduction to React'"
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
								Save
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	)
}

export default TitleForm
