"use client"

import { ChevronDownIcon, ChevronRightIcon, UserCircle } from "lucide-react"
import * as React from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import axios from "axios"

export default function ContactList() {
  const [expandedRows, setExpandedRows] = React.useState([])
  const [contacts,setContacts]=React.useState([])

  const toggleRow = (id) => {
    setExpandedRows((current) =>
      current.includes(id) ? current.filter((rowId) => rowId !== id) : [...current, id]
    )
  }
  async function fetchContacts() {
    const data=await axios.get('https://backend.gezeno.in/api/users/get-contacts')
    console.log("contact data",data)
    setContacts(data.data)
    
}
React.useEffect(()=>{
    async function fetcher(){
        await fetchContacts()
    }
    fetcher()
},[])
  return (
    <div className="rounded-lg border bg-card w-full">
      <Table className="w-full">
        {/* <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-[50px] text-center"></TableHead>
            <TableHead className="w-[200px] text-left">Name</TableHead>
            <TableHead className="w-[250px] text-left">Email</TableHead>
            <TableHead className="text-left">Message</TableHead>
          </TableRow>
        </TableHeader> */}
        <TableBody>
          {contacts.map((contact) => (
            <React.Fragment key={contact.id}>
              <Collapsible
                open={expandedRows.includes(contact.id)}
                onOpenChange={() => toggleRow(contact.id)}
              >
                <TableRow className="hover:bg-gray-50">
                  {/* Expand/Collapse Button */}
                  <TableCell className="text-center py-2">
                    <CollapsibleTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-200">
                      {expandedRows.includes(contact.id) ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                  </TableCell>

                  {/* Name Column */}
                  <TableCell className="py-2">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-6 w-6 text-gray-500" />
                      <span className="whitespace-nowrap">{contact.name}</span>
                    </div>
                  </TableCell>

                  {/* Email Column */}
                  <TableCell className="py-2 text-gray-700">{contact.email}</TableCell>

                  {/* Message Column */}
                  <TableCell className="py-2 text-gray-700 max-w-[350px] truncate">
                    {contact.message}
                  </TableCell>
                </TableRow>

                {/* Expanded Message Row */}
                <CollapsibleContent asChild>
                  <TableRow>
                    <TableCell colSpan={4} className="p-4 pb-6 bg-gray-50">
                      <div className="space-y-2">
                        <div className="font-medium">Full Message:</div>
                        <div className="text-sm text-gray-600">{contact.message}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                </CollapsibleContent>
              </Collapsible>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}