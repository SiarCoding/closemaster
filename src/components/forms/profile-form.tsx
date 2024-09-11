'use client' // Markiert die Komponente als Client-Komponente

import { WorkflowFormSchema } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
//import { toast } from 'sonner'
//import { onCreateWorkflow } from '@/app/(main)/(pages)/workflows/_actions/workflow-connections'
import { useModal } from '@/providers/modal-provider'

type Props = {
  title?: string
  subTitle?: string
}

const Workflowform = ({ subTitle, title }: Props) => {
  const { setClose } = useModal()
  const form = useForm<z.infer<typeof WorkflowFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(WorkflowFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const isLoading = form.formState.isSubmitting // Verwende 'isSubmitting' anstelle von 'isLoading'
  const router = useRouter()

 // const handleSubmit = async (values: z.infer<typeof WorkflowFormSchema>) => {
  //  const workflow = await onCreateWorkflow(values.name, values.description)
    //if (workflow) {
     // toast.message(workflow.message)
      //router.refresh()
   // }
    //setClose()
  //}

  return (
    <Card className="w-full max-w-[650px] border-none">
      {title && subTitle && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subTitle}</CardDescription>
        </CardHeader>
      )}
      <CardContent/>
        
        
    </Card>
  )
}

export default Workflowform
