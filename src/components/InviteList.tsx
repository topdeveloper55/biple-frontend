import { useEffect, useState } from "react"
import GradientText from "./GradientText"
import Modal from "./Modal"
import * as roomActions from 'action/room'
import { MatrixService } from "services"
import { selectRoom, selectTab } from "action/navigation"
import navigation from "services/navigation"
import cons from "services/cons"
import Avatar from "./Avatar"
import colorMXID from "utils/colorMXID"

function InviteList({ open, onClose }: any) {
  const [loading, setLoading] = useState(false)
  const [procInvite, changeProcInvite] = useState(new Set())

  const acceptInvite = (roomId: string, isDM: boolean) => {
    procInvite.add(roomId)
    changeProcInvite(new Set(Array.from(procInvite)))
    roomActions.join(roomId, isDM)
  }

  const rejectInvite = (roomId: string, isDM: boolean) => {
    procInvite.add(roomId)
    changeProcInvite(new Set(Array.from(procInvite)))
    roomActions.leave(roomId)
  }

  const updateInviteList = (roomId: string) => {
    if (procInvite.has(roomId)) procInvite.delete(roomId)
    changeProcInvite(new Set(Array.from(procInvite)))

    const rl = MatrixService.roomList
    const directCount = rl?.inviteDirects.size ? rl?.inviteDirects.size : 0
    const roomCount = rl?.inviteRooms.size ? rl?.inviteRooms.size : 0
    const totalInvites = directCount + roomCount
    const room = MatrixService.matrixClient?.getRoom(roomId)
    const isRejected = room === null || room?.getMyMembership() !== 'join'
    if (!isRejected) {
      // if(room?.isSpaceRoom()) selectTab(roomId)
      // else selectRoom(roomId)
      navigation._selectRoom(roomId)
      onClose()
    }
    if (totalInvites === 0) onClose()
  }

  useEffect(() => {
    MatrixService.roomList?.on(cons.events.roomList.INVITELIST_UPDATED, updateInviteList)

    return () => {
      MatrixService.roomList?.removeListener(cons.events.roomList.INVITELIST_UPDATED, updateInviteList)
    }
  }, [procInvite])
  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full flex flex-col min-h-[600px]">
        <div className="flex justify-center border-b border-[#697A8D66] py-[18px] text-[36px]">
          <GradientText size={36} value="Invites" />
        </div>
        <div className="flex flex-col flex-grow max-h-[460px] p-4 gap-2 bg-[#F3F3F5] dark:bg-[#1F1F22] mt-4 rounded-lg overflow-y-auto text-[#a6aacf] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
          {
            Array.from(MatrixService.roomList?.inviteDirects ? MatrixService.roomList?.inviteDirects : []).map((roomId: string) => {
              const myRoom = MatrixService.matrixClient?.getRoom(roomId)
              if (myRoom === null) return null
              const roomName = myRoom?.name
              const id = myRoom?.getDMInviter() || roomId
              return (
                <div
                  className={`cursor-pointer flex w-full items-center gap-4 rounded-lg text-primary dark:text-white`}
                  key={roomId}
                >
                  <Avatar bgColor={colorMXID(id)} text={roomName} />
                  <div className="flex flex-col flex-grow justify-between">
                    <p className="text-primary text-sm dark:text-white">{roomName}</p>
                    <p className="text-secondary text-[12px] dark:text-white">{id}</p>
                  </div>
                  {
                    procInvite.has(myRoom?.roomId) ?
                      <div className="flex justify-center w-[16px] h-[16px]">
                        <svg
                          className="inline min-w-6 min-h-6 text-gray-200 animate-spin fill-white"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      </div> :
                      <div className="flex items-center gap-2">
                        <button onClick={() => rejectInvite(roomId, true)} className="bg-gradient-to-r from-[#4776E615] to-[#8E54E915] hover:bg-gradient-to-r hover:from-[#4776E644] hover:to-[#8E54E944] text-sm font-bold rounded-lg text-white px-[12px] py-[8px]"><GradientText value="Reject" size={14} /></button>
                        <button onClick={() => acceptInvite(roomId, true)} className="bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6dd] hover:to-[#8E54E9dd] text-sm font-bold rounded-lg text-white px-[12px] py-[8px]">Accept</button>
                      </div>
                  }
                </div>
              )
            })
          }
          {loading && (
            <div className="flex w-full justify-center mt-8">
              <div role="status">
                <svg
                  className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default InviteList
