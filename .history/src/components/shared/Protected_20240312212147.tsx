interface ProtectedProps {
  children: React.ReactNode
}

const Protected = ({ children }: ProtectedProps) => {
  return <>{children}</>
}

export default Protected
