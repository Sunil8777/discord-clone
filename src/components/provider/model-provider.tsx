
import CreateServerModel from '../models/create-server-model'
import EditServerModel from '../models/edit-server-model'
import InviteModel from '../models/invite-model'
import ManageMembersModel from '../models/manage-members-model'

export default function ModelProvider() {
    
  return (
    <>
      <CreateServerModel/>
      <InviteModel/>
      <EditServerModel/>
      <ManageMembersModel/>
    </>
  )
}
