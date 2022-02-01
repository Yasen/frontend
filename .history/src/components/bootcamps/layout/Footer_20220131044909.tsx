import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => {
  return {
    footer: {
      background: 'silver',
      width: '100%',
      position: 'fixed',
      height: '60px',
      bottom: 0,
      margin: 0,
    },
    footerText: {
      textAlign: 'center',
    },
  }
})

export default function MyFooter() {
  const classes = useStyles()

  return (
    <div className={classes.footer}>
      <p className={classes.footerText}> Подкрепи БГ &copy;</p>
    </div>
  )
}