import BootcampInternGrid from './BootcampInternGrid'
import { Grid } from '@mui/material'
import MyLayout from './MyLayout'

export default function BootcampInternPage(props: any) {
  return (
    <MyLayout>
      <Grid container>
        <BootcampInternGrid />
      </Grid>
    </MyLayout>
  )
}
