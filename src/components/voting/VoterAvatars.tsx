import React from 'react'
import { User } from './VotingInterface'

interface VoterAvatarsProps {
  users: User[]
}

export const VoterAvatars: React.FC<VoterAvatarsProps> = ({ users }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-3">
        {users.map((user) => (
          <img
            key={user.id}
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-amber-400 hover:scale-110 transition-transform duration-200"
            title={user.name}
          />
        ))}
      </div>
      <span className="text-slate-600 text-sm ml-2">{users.length} voters</span>
    </div>
  )
}
