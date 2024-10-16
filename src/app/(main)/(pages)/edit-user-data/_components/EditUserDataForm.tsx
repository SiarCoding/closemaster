'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@clerk/nextjs"

const industries = [
  "IT und Software",
  "Finanzdienstleistungen",
  "Gesundheitswesen",
  "Bildung und E-Learning",
  "Marketing und Vertrieb",
  "Immobilien",
  "Beratung und Unternehmensdienstleistungen",
  "Sonstige"
]

export default function EditUserData() {
  const router = useRouter()
  const { user } = useUser()
  const [formData, setFormData] = useState({
    company: '',
    product: '',
    productDescription: '',
    industry: '',
    otherIndustry: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        company: user.publicMetadata.company as string || '',
        product: user.publicMetadata.product as string || '',
        productDescription: user.publicMetadata.productDescription as string || '',
        industry: user.publicMetadata.industry as string || '',
        otherIndustry: ''
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleIndustryChange = (value: string) => {
    setFormData({ ...formData, industry: value, otherIndustry: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSubmit = {
      ...formData,
      industry: formData.industry === 'Sonstige' ? formData.otherIndustry : formData.industry
    }
    try {
      const response = await fetch('/api/updateUserData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      })
      if (response.ok) {
        await user?.reload()
        router.push('/dashboard')
        router.refresh()
      } else {
        const errorData = await response.json()
        console.error('Error updating user data:', errorData)
        throw new Error(`Failed to update user data: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating user data:', error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Benutzerprofil bearbeiten</CardTitle>
        <CardDescription>Nutzerdaten verwalten</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Firma</Label>
            <Input id="company" name="company" value={formData.company} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product">Produkt</Label>
            <Input id="product" name="product" value={formData.product} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productDescription">Produktbeschreibung</Label>
            <Textarea id="productDescription" name="productDescription" value={formData.productDescription} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industrie</Label>
            <Select onValueChange={handleIndustryChange} value={formData.industry}>
              <SelectTrigger>
                <SelectValue placeholder="Industrie auswählen" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {formData.industry === 'Sonstige' && (
            <div className="space-y-2">
              <Label htmlFor="otherIndustry">Sonstige Industrie</Label>
              <Input id="otherIndustry" name="otherIndustry" value={formData.otherIndustry} onChange={handleChange} required />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto">Speichern</Button>
        </CardFooter>
      </form>
    </Card>
  )
}