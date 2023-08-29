import { MatrixEvent } from 'matrix-js-sdk'
import { useEffect, useState } from 'react'
import { MatrixService } from 'services'
import { getPowerLabel, getUsernameOfRoomMember } from 'utils/matrixUtil'
import { memberByAtoZ, memberByPowerLevel } from 'utils/sort'
import GradientText from './GradientText'
import dateFormat from 'dateformat'
import { isInSameDay } from 'utils/common'

const Message = ({ data, timeline }: any) => {
  const [events, setEvents] = useState<any>([])
  useEffect(() => {
    if (timeline) setTimeline(timeline.liveTimeline.events, timeline.roomId)
  }, [timeline])
  const normalizeMembers = (members: any) => {
    // const mx = MatrixService.matrixClient;
    return members.map((member: any) => ({
      userId: member.userId,
      name: getUsernameOfRoomMember(member),
      username: member.userId.slice(1, member.userId.indexOf(':')),
      // avatarSrc: member.getAvatarUrl(mx?.baseUrl, 24, 24, 'crop'),
      avatarSrc: member.user.avatarUrl,
      peopleRole: getPowerLabel(member.powerLevel),
      powerLevel: members.powerLevel,
    }));
  }
  const getTimeString = (timestamp: number) => {
    const date = new Date(timestamp);
    const formattedFullTime = dateFormat(date, 'dd mmmm yyyy, hh:MM TT')
    let formattedDate = formattedFullTime

    const compareDate = new Date()
    const isToday = isInSameDay(date, compareDate)
    compareDate.setDate(compareDate.getDate() - 1)
    const isYesterday = isInSameDay(date, compareDate)

    formattedDate = dateFormat(date, isToday || isYesterday ? 'hh:MM TT' : 'dd/mm/yyyy')
    if (isYesterday) {
      formattedDate = `Yesterday, ${formattedDate}`
    }
    return (<time
      dateTime={date.toISOString()}
      title={formattedFullTime}
    >
      {formattedDate}
    </time>)
  }
  const setTimeline = (events: MatrixEvent[], roomId: string) => {
    const room = MatrixService.matrixClient?.getRoom(roomId)
    const memberOfMembership = normalizeMembers(room?.getMembersWithMembership('join')).sort(memberByAtoZ).sort(memberByPowerLevel)
    const ret = events.map((matrixEvent) => {
      // const user = MatrixService.matrixClient?.getUser(matrixEvent.event.sender as string)
      // console.log(memberOfMembership)
      const user = memberOfMembership.find((member: any) => member.userId === matrixEvent.event.sender as string)
      // const date = dateFormat(matrixEvent.localTimestamp, 'dd/mm/yyyy, hh:MM TT')
      const date = getTimeString(matrixEvent.localTimestamp)
      const content = matrixEvent.event.content?.body
      // console.log(date)
      if(matrixEvent.event.type === 'm.room.message')
      return (
        <div className="w-full flex flex-col">
          {/* {data.replier !== undefined && (
            <div className="w-full flex min-h-[32px] items-center pl-[17px]">
              <svg
                className="max-h-[15px] max-w-[26px] self-end"
                width="26"
                height="15"
                viewBox="0 0 26 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="26"
                  y1="0.5"
                  y2="0.5"
                  stroke="#697A8D"
                  strokeOpacity="0.3"
                />
                <line
                  x1="0.5"
                  y1="2.18557e-08"
                  x2="0.499999"
                  y2="15"
                  stroke="#697A8D"
                  strokeOpacity="0.3"
                />
              </svg>
              <img
                className="rounded-full w-[21px] h-[21px] mr-2"
                src={data.replier?.image}
                alt=""
              />
              <GradientText value={'@' + data.replier?.username} size={11} />
              <p className="text-secondary dark:text-white text-[11px] ml-2">
                {data.replier?.contents}
              </p>
            </div>
          )} */}
          <div className="w-full flex items-start gap-2">
            <img
              className="rounded-full w-[35px] h-[35px]"
              src={user?.avatarSrc}
              alt=""
            />
            <div className="flex flex-col flex-grow items-start">
              <div className="min-h-[35px] flex items-center gap-2 text-primary dark:text-white font-semibold">
                <GradientText value={user?.username as string} size={15} />
                <span className="text-[15px]">-</span>
                <span className="text-[11px]">{user?.peopleRoe}</span>
                <i className="text-[11px]">{date}</i>
              </div>
              <pre className="w-full whitespace-pre-line text-secondary dark:text-white">
                {content}
              </pre>
            </div>
          </div>
        </div>
      )
    })
    // return ret
    setEvents(ret)
  }
  // console.log(timeline.liveTimeline.events)
  return (
    <div className="w-full flex flex-col">
      {data.replier !== undefined && (
        <div className="w-full flex min-h-[32px] items-center pl-[17px]">
          <svg
            className="max-h-[15px] max-w-[26px] self-end"
            width="26"
            height="15"
            viewBox="0 0 26 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="26"
              y1="0.5"
              y2="0.5"
              stroke="#697A8D"
              strokeOpacity="0.3"
            />
            <line
              x1="0.5"
              y1="2.18557e-08"
              x2="0.499999"
              y2="15"
              stroke="#697A8D"
              strokeOpacity="0.3"
            />
          </svg>
          <img
            className="rounded-full w-[21px] h-[21px] mr-2"
            src={data.replier?.image}
            alt=""
          />
          <GradientText value={'@' + data.replier?.username} size={11} />
          <p className="text-secondary dark:text-white text-[11px] ml-2">
            {data.replier?.contents}
          </p>
        </div>
      )}
      <div className="w-full flex items-start gap-2">
        <img
          className="rounded-full w-[35px] h-[35px]"
          src={data.user.image}
          alt=""
        />
        <div className="flex flex-col flex-grow items-start">
          <div className="min-h-[35px] flex items-center gap-2 text-primary dark:text-white font-semibold">
            <GradientText value={data.user.username} size={15} />
            <span className="text-[15px]">-</span>
            <span className="text-[11px]">{data.user.role}</span>
            <i className="text-[11px]">{data.date}</i>
          </div>
          <pre className="w-full whitespace-pre-line text-secondary dark:text-white">
            {data.contents}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default Message
