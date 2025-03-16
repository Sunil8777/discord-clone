
import CreateChannelModel from '../models/create-channel-model'
import CreateServerModel from '../models/create-server-model'
import DeleteChannelModel from '../models/delete-channel-model'
import DeleteServerModel from '../models/delete-server-model'
import EditServerModel from '../models/edit-server-model'
import InviteModel from '../models/invite-model'
import LeaveServerModel from '../models/leaver-server-model'
import ManageMembersModel from '../models/manage-members-model'

export default function ModelProvider() {
    
  return (
    <>
      <CreateServerModel/>
      <InviteModel/>
      <EditServerModel/>
      <ManageMembersModel/>
      <CreateChannelModel/>
      <LeaveServerModel/>
      <DeleteServerModel/>
      <DeleteChannelModel/>
    </>
  )
}
