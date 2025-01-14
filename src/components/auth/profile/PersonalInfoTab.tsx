import { Box, Button, Link, Modal, Typography } from '@mui/material'
import { useSession } from 'common/util/useSession'
import { useCurrentPerson } from 'common/util/useCurrentPerson'
import Tab from './Tab'
import EditIcon from '@mui/icons-material/Edit'
import { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { getRelativeDate } from 'common/util/date'
import UpdateNameModal from './UpdateNameModal'
import UpdateBirthdayModal from './UpdateBirthdayModal'
import { useRouter } from 'next/router'
import getConfig from 'next/config'
import ExternalLink from 'components/common/ExternalLink'

const useStyles = makeStyles({
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    backgroundColor: '#EEEEEE',
    padding: 20,
  },
  editSpan: {
    color: '#294E85',
  },
  deleteAccountButton: { color: '#294E85', float: 'right' },
  editIcon: { position: 'relative', top: '7px' },
  heading: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '24px',
    lineHeight: '123.5%',
    letterSpacing: '0.25px',
    color: '#000000',
    paddingLeft: '30px',
  },
  bold: {
    fontWeight: 'bold',
  },
  notAvaible: {
    color: '#F22727',
  },
  graySpan: {
    fontFamily: 'Lato, sans-serif',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '18px',
    lineHeight: '133.4%',
    color: '#909090',
  },
  h5: {
    fontFamily: 'Lato, sans-serif',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '22px',
    lineHeight: '133.4%',
  },
  h3: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '25px',
    lineHeight: '116.7%',
    margin: '0',
  },
})

function PersonalInfoTab(props: { value: number; index: number }) {
  const { value, index } = props
  const { session } = useSession()
  const { data: { user: person } = { user: null }, refetch } = useCurrentPerson()
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false)
  const [isUpdateNameModalOpen, setIsUpdateNameModalOpen] = useState(false)
  const [isUpdateBirthdayModalOpen, setIsUpdateBirthdayModalOpen] = useState(false)
  const classes = useStyles()
  const {
    publicRuntimeConfig: { keycloakConfig },
  } = getConfig()
  const link = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/${keycloakConfig.clientId}/password`

  return (
    <>
      <Tab value={value} index={index}>
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '10px 30px',
            margin: '10px 0 0 0',
          }}>
          <h3 className={classes.h3}>Лична информация</h3>
        </Box>
        <Box sx={{ background: 'white', paddingTop: '30px' }}>
          <h2 className={classes.heading}>Login информация:</h2>
          <Box sx={{ display: 'flex', paddingLeft: '30px' }}>
            <Box
              sx={{
                backgroundColor: '#E9F6FF',
                padding: '10px',
                flexBasis: '50%',
                marginRight: '20px',
              }}>
              <p className={classes.bold}>email адрес:</p>
              <p>{session?.email}</p>
            </Box>
            <Box
              sx={{
                backgroundColor: '#E9F6FF',
                padding: '10px',
                flexBasis: '50%',
                position: 'relative',
                marginRight: '10px',
              }}>
              <p className={classes.bold}>парола:</p>
              <p>***********</p>
              <Box sx={{ position: 'absolute', right: '5px', top: '5px' }}>
                <ExternalLink href={link}>
                  <EditIcon className={classes.editIcon} />
                  <span className={classes.editSpan}>Редактирай</span>
                </ExternalLink>
              </Box>
            </Box>
          </Box>
          <hr />
          <h2 className={classes.heading}>Лична информация:</h2>
          <Box sx={{ display: 'flex' }}>
            <Box
              sx={{
                backgroundColor: '#E9F6FF',
                padding: '10px',
                flexBasis: '50%',
                marginRight: '20px',
                position: 'relative',
                marginLeft: '30px',
              }}>
              <p className={classes.bold}>Име:</p>
              <p>
                {person?.firstName} {person?.lastName}
              </p>
              <Box sx={{ position: 'absolute', right: '5px', top: '5px' }}>
                <Link href="#" onClick={() => setIsUpdateNameModalOpen(true)}>
                  <EditIcon className={classes.editIcon} />
                  <span className={classes.editSpan}>Редактирай</span>
                </Link>
              </Box>
            </Box>
            <Box
              sx={{
                backgroundColor: '#E9F6FF',
                padding: '10px',
                flexBasis: '50%',
                position: 'relative',
                marginRight: '10px',
              }}>
              <p className={classes.bold}>рожден ден:</p>
              <p className={person?.birthday ? '' : classes.notAvaible}>
                {person?.birthday ? getRelativeDate(person?.birthday) : 'не e наличен'}
              </p>
              <Box sx={{ position: 'absolute', right: '5px', top: '5px' }}>
                <Link href="#" onClick={() => setIsUpdateBirthdayModalOpen(true)}>
                  <EditIcon className={classes.editIcon} />
                  <span className={classes.editSpan}>Редактирай</span>
                </Link>
              </Box>
            </Box>
          </Box>
          <hr />
          <Link
            href="#"
            className={classes.deleteAccountButton}
            onClick={() => setIsDeleteAccountModalOpen(true)}>
            изтриване на акаунт/ профил
          </Link>
        </Box>
      </Tab>
      <Modal
        open={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box className={classes.modal}>
          <Typography variant="h6" component="h2">
            Изтриване на акаунт
          </Typography>
          <Typography className={classes.graySpan}>Съжаляваме, че ни напускате!</Typography>
          <Typography className={classes.heading}>Преди да ни напуснете ...</Typography>
          <hr />
          <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
            <li className={classes.h5}>
              Ако ви е омръзнало да получавате имейли, деактивирайте ги
              <Link href="#"> тук</Link>.
            </li>
            <li className={classes.h5}>
              Ако .........................., моля пишете <Link href="#">тук</Link>.
            </li>
            <li className={classes.h5}>Изтриването на акаунт е необратимо.</li>
            <li className={classes.h5}>Ще бъде невъзможно да възстановите акаунта си.</li>
          </ul>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            onClick={() => setIsDeleteAccountModalOpen(false)}>
            Запази моя акаунт
          </Button>
          <Button variant="contained" size="large" color="secondary" style={{ marginLeft: '10px' }}>
            Изтрий моя акаунт
          </Button>
        </Box>
      </Modal>
      {person ? (
        <>
          <UpdateNameModal
            isOpen={isUpdateNameModalOpen}
            person={person}
            handleClose={() => {
              setIsUpdateNameModalOpen(false)
              refetch()
            }}
          />
          <UpdateBirthdayModal
            isOpen={isUpdateBirthdayModalOpen}
            person={person}
            handleClose={() => {
              setIsUpdateBirthdayModalOpen(false)
              refetch()
            }}
          />
        </>
      ) : (
        ''
      )}
    </>
  )
}

export default PersonalInfoTab
