import TermsAndConditionsForm from "@/components/TermsAndConditionForm"
// import { getTermsAndConditions } from '../actions/termsAndConditions'

export default async function TermsAndConditionsPage() {
//   const savedTnC = await getTermsAndConditions()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
      <TermsAndConditionsForm  />
    </div>
  )
}

