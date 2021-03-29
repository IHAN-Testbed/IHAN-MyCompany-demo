/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Container, Text } from './index'

const tableRowBaseSx = {
  variant: 'flex.row',
}

const headerRowSx = {
  ...tableRowBaseSx,
}

const tableCellBaseSx = {
  flex: '25%',
}

const headerCellSx = {
  ...tableCellBaseSx,
  variant: 'text.notice',
}

const tableCellContentSx = {
  ...tableCellBaseSx,
  borderLeft: 'menuItem',
}

const tableRowSx = {
  ...tableRowBaseSx,
  textAlign: 'center',
  bg: 'white',
  px: [2],
  py: [1],
  my: ['0.25rem'],
  borderRadius: 'pill',
}

const footerRowSx = {
  ...tableRowBaseSx,
}

const footerCellSx = {
  ...tableCellBaseSx,
  mt: [2],
  textAlign: 'center',
  fontWeight: 'bold',
}

export default ({ ownershipData = { owners: [], shareSeries: [] } }) => {
  ownershipData.owners.forEach((o) => {
    o.totalShares = 0
    o.totalVotes = 0
    o.ownerships.forEach((os) => {
      o.totalShares += os.quantity

      const series = ownershipData.shareSeries.find(
        (ss) => ss.seriesName === os.seriesName
      )

      if (typeof series !== 'undefined') {
        o.totalVotes += os.quantity * series.votesPerShare
      }
    })
  })

  ownershipData.totalSharesAllSeries = 0
  ownershipData.totalVotesAllSeries = 0

  ownershipData.shareSeries.forEach((s) => {
    ownershipData.totalSharesAllSeries += s.totalShares
    ownershipData.totalVotesAllSeries += s.totalShares * s.votesPerShare
  })

  return (
    <Container>
      {ownershipData.shareSeries.map((s) => {
        return (
          <Container csx={{ my: [2] }} key={s.seriesName}>
            <Text csx={{ variant: 'text.notice', fontSize: [3, 3] }}>
              Share series {s.seriesName}
            </Text>
            <Text>Votes per share {s.votesPerShare}</Text>
            <Text>Total shares {s.totalShares}</Text>
          </Container>
        )
      })}

      {ownershipData.owners.length > 0 && (
        <Container
          csx={{
            variant: 'flex.column',
            width: '90%',
            alignSelf: 'start',
            mt: [4],
          }}
          baseProps={{ className: 'ownership-table' }}
        >
          <Container csx={headerRowSx} baseProps={{ className: 'table-header' }}>
            <div sx={headerCellSx}>Name</div>
            <div sx={headerCellSx}>Quantity</div>
            <div sx={headerCellSx}>Voting right %</div>
            <div sx={headerCellSx}>Ownership %</div>
          </Container>

          {ownershipData.owners.map((o) => {
            return (
              <Container
                key={o.name + '_' + o.totalShares}
                csx={tableRowSx}
                baseProps={{ className: 'table-row' }}
              >
                <div
                  sx={{
                    ...tableCellBaseSx,
                    textAlign: 'left',
                    pl: [3],
                  }}
                >
                  {o.name}
                </div>
                <div sx={tableCellContentSx}>{o.totalShares}</div>
                <div sx={tableCellContentSx}>
                  {parseFloat(
                    (o.totalVotes / ownershipData.totalVotesAllSeries) * 100
                  ).toFixed(2) + '%'}
                </div>
                <div sx={tableCellContentSx}>
                  {parseFloat(
                    (o.totalShares / ownershipData.totalSharesAllSeries) * 100
                  ).toFixed(2) + '%'}
                </div>
              </Container>
            )
          })}

          <Container csx={footerRowSx} baseProps={{ className: 'table-footer' }}>
            <div sx={footerCellSx} />
            <div sx={footerCellSx}>{ownershipData.totalSharesAllSeries}</div>
            <div sx={footerCellSx}>100%</div>
            <div sx={footerCellSx}>100%</div>
          </Container>
        </Container>
      )}
    </Container>
  )
}
