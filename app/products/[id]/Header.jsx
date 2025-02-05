import NavBar from '@/components/NavBar'

export default async function Header({ homeconfig }) {
  return (
    <div>
      <NavBar data={homeconfig} />
    </div>
  )
}
