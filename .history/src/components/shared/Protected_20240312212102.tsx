interface ProtectedProps {
  children: React.ReactNode
}

const Protected = ({ PropsWithChildren }: ProtectedProps) => {
  return <div>Protected</div>
}

export default Protected
