import React, { useState, useEffect } from 'react'
import { Spinner } from 'theme-ui'
import { Container, PersonIdentityCard } from 'components'
import { API } from 'utilities'
import { faUsers } from '@fortawesome/free-solid-svg-icons'

import demo1Img from 'assets/images/demo-person/demo-1.jpg'
import demo2Img from 'assets/images/demo-person/demo-2.jpg'
import demo3Img from 'assets/images/demo-person/demo-3.jpg'
import demo4Img from 'assets/images/demo-person/demo-4.jpg'
import demo5Img from 'assets/images/demo-person/demo-5.jpg'

const userMap = {
  'James Jaatinen': {
    title: 'Chairman',
    image: demo3Img,
    socials: {
      twitter: true,
      linkedin: true,
    },
  },
  'Brenda Taylor': {
    title: 'Member',
    image: demo1Img,
    socials: {
      twitter: true,
      linkedin: true,
    },
  },
  'Mike Olsen': {
    title: 'Member',
    image: demo2Img,
    socials: {
      twitter: false,
      linkedin: true,
    },
  },
  'Mina Leef': {
    title: 'Member',
    image: demo4Img,
    socials: {
      twitter: false,
      linkedin: true,
    },
  },
  'Yost Robinson': {
    title: 'Member',
    image: demo5Img,
    socials: {
      twitter: true,
      linkedin: true,
    },
  },
}

function BoardView({ company = {} }) {
  const [boardMembersRequestData, setBoardMembersRequestData] = useState({
    boardMembers: [],
    isLoading: true,
    error: '',
  })

  useEffect(() => {
    ;(async () => {
      if (company.hasOwnProperty('businessId')) {
        const { ok, data, error } = await API.listLinks(company.boardGroupId, 'in')

        if (ok) {
          const boardMembers = []

          for (const l of data.links) {
            const { ok, data } = await API.getIdentity(l.from)
            if (ok) {
              data.data = { ...data.data, ...userMap[data.data.name] }

              boardMembers.push(data)
            }
          }

          setBoardMembersRequestData({ boardMembers, error: '', isLoading: false })
        } else {
          setBoardMembersRequestData({ boardMembers: [], error, isLoading: false })
        }
      }
    })()
  }, [company])

  return (
    <Container
      csx={{
        variant: ['flex.columnCenterNoMargin', 'flex.row'],
        mt: [3, null],
      }}
    >
      {boardMembersRequestData.isLoading && <Spinner sx={{ m: 3, mx: 'auto' }} />}

      {boardMembersRequestData.boardMembers.map((bm) => {
        return (
          <PersonIdentityCard
            csx={{ mr: [null, 4], m: [2, null] }}
            icon={faUsers}
            key={bm.id}
            identity={bm}
          />
        )
      })}
    </Container>
  )
}

export default BoardView
