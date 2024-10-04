import React, { useState } from 'react'
import { ChevronRight, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ApiStep = {
  id: string
  type: 'GET' | 'POST' | 'GET_COMMENTS'
  url: string
  postId?: string // For the comments API
  body?: Record<string, any>
  response?: any
  error?: string
  useLastResponse?: boolean
}

export default function ApiChainingDashboard() {
  const [workflow, setWorkflow] = useState<ApiStep[]>([])
  const [loading, setLoading] = useState(false)

  const addStep = () => {
    setWorkflow([...workflow, { id: Date.now().toString(), type: 'GET', url: '', useLastResponse: false }])
  }

  const updateStep = (id: string, updates: Partial<ApiStep>) => {
    setWorkflow(workflow.map(step => (step.id === id ? { ...step, ...updates } : step)))
  }

  const removeStep = (id: string) => {
    setWorkflow(workflow.filter(step => step.id !== id))
  }

  const executeWorkflow = async () => {
    setLoading(true)
    let lastResponse: any = null

    for (const step of workflow) {
      try {
        let url = step.url
        let body = step.body

        // Check if it's a comment API step
        if (step.type === 'GET_COMMENTS' && step.postId) {
          url = `https://jsonplaceholder.typicode.com/comments?postId=${step.postId}`
        }

        if (step.useLastResponse && lastResponse) {
          url = url.replace(/\{([^}]+)\}/g, (_, key) => lastResponse[key] || '')

          if (step.type === 'POST' && typeof body === 'object') {
            body = Object.entries(body).reduce((acc, [key, value]) => {
              acc[key] = typeof value === 'string' && value.startsWith('{') && value.endsWith('}')
                ? lastResponse[value.slice(1, -1)] || value
                : value
              return acc
            }, {} as Record<string, any>)
          }
        }

        const response = await fetch(url, {
          method: step.type === 'POST' ? 'POST' : 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: step.type === 'POST' ? JSON.stringify(body) : undefined,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        updateStep(step.id, { response: data })
        lastResponse = data
      } catch (error: unknown) {
        let errorMessage: string
        if (error instanceof Error) {
          errorMessage = error.message
        } else {
          errorMessage = String(error)
        }
        updateStep(step.id, { error: errorMessage })
        break
      }
    }

    setLoading(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Chaining Dashboard</h1>
      <div className="space-y-4">
        {workflow.map((step, index) => (
          <div key={step.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Step {index + 1}</h2>
              <Button variant="ghost" size="icon" onClick={() => removeStep(step.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`type-${step.id}`}>Request Type</Label>
                <Select
                  value={step.type}
                  onValueChange={(value) => updateStep(step.id, { type: value as 'GET' | 'POST' | 'GET_COMMENTS' })}
                >
                  <SelectTrigger id={`type-${step.id}`}>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="GET_COMMENTS">Get Comments by Post</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`url-${step.id}`}>URL</Label>
                <Input
                  id={`url-${step.id}`}
                  value={step.url}
                  onChange={(e) => updateStep(step.id, { url: e.target.value })}
                  placeholder="Enter API URL"
                />
              </div>
              {step.type === 'POST' && (
                <div className="col-span-2">
                  <Label htmlFor={`body-${step.id}`}>Request Body</Label>
                  <textarea
                    id={`body-${step.id}`}
                    value={JSON.stringify(step.body, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsedBody = JSON.parse(e.target.value)
                        updateStep(step.id, { body: parsedBody })
                      } catch (error) {
                        console.error('Invalid JSON input:', error)
                      }
                    }}
                    className="w-full h-24 p-2 border rounded"
                    placeholder="Enter JSON body"
                  />
                </div>
              )}
              {step.type === 'GET_COMMENTS' && (
                <div>
                  <Label htmlFor={`postId-${step.id}`}>Post ID</Label>
                  <Input
                    id={`postId-${step.id}`}
                    value={step.postId || ''}
                    onChange={(e) => updateStep(step.id, { postId: e.target.value })}
                    placeholder="Enter Post ID"
                  />
                </div>
              )}
              <div className="col-span-2">
                <Label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={step.useLastResponse}
                    onChange={(e) => updateStep(step.id, { useLastResponse: e.target.checked })}
                    className="mr-2"
                  />
                  Use data from previous response
                </Label>
              </div>
            </div>
            {step.response && (
              <div className="mt-4">
                <h3 className="font-semibold">Response:</h3>
                <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                  {JSON.stringify(step.response, null, 2)}
                </pre>
              </div>
            )}
            {step.error && (
              <div className="mt-4 text-red-500">
                <h3 className="font-semibold">Error:</h3>
                <p>{step.error}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <Button onClick={addStep}>
          <Plus className="mr-2 h-4 w-4" /> Add Step
        </Button>
        <Button onClick={executeWorkflow} disabled={loading || workflow.length === 0}>
          {loading ? (
            'Executing...'
          ) : (
            <>
              Execute Workflow <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
