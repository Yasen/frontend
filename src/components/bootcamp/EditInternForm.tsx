import React from 'react'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { FormikHelpers } from 'formik'
import { useMutation } from 'react-query'
import { Button, Grid, Typography } from '@mui/material'
import { AxiosError, AxiosResponse } from 'axios'
import { useTranslation } from 'next-i18next'
import { makeStyles } from '@mui/styles'

import { routes } from 'common/routes'
import { AlertStore } from 'stores/AlertStore'
import { editBootcampIntern } from 'common/rest'
import { BootcampFormData, BootcampInput, BootcampResponse } from 'gql/bootcamp'
import GenericForm from 'components/common/form/GenericForm'
import FormTextField from 'components/common/form/FormTextField'
import { name, phone } from 'common/form/validation'
import { ApiErrors, isAxiosError, matchValidator } from 'common/api-errors'
import LinkButton from 'components/common/LinkButton'

const useStyles = makeStyles({
  container: {
    maxWidth: '700px',
    margin: '0 auto',
  },
})

const validationSchema: yup.SchemaOf<BootcampFormData> = yup.object().defined().shape({
  firstName: name.required(),
  lastName: name.required(),
})

const defaults: BootcampFormData = {
  firstName: '',
  lastName: '',
}

type BootcampFormProps = {
  id: string
  initialValues?: BootcampFormData
}

type EditBootcampInternProp = {
  id: string
  data: BootcampInput
}

export default function EditInternForm({ id, initialValues = defaults }: BootcampFormProps) {
  const classes = useStyles()
  const mutation = useMutation<
    AxiosResponse<BootcampResponse>,
    AxiosError<ApiErrors>,
    EditBootcampInternProp
  >({
    mutationFn: editBootcampIntern,
    onError: () => AlertStore.show(t('bootcamp:alerts.edit-row.error'), 'error'),
    onSuccess: () => AlertStore.show(t('bootcamp:alerts.edit-row.success'), 'success'),
  })
  const { t } = useTranslation()
  const router = useRouter()

  const onSubmit = async (
    values: BootcampFormData,
    { setFieldError }: FormikHelpers<BootcampFormData>,
  ) => {
    try {
      const data = {
        firstName: values.firstName,
        lastName: values.lastName,
      }
      await mutation.mutateAsync({
        id,
        data,
      })
      router.push(routes.bootcamp.index)
    } catch (error) {
      console.error(error)
      if (isAxiosError(error)) {
        const { response } = error as AxiosError<ApiErrors>
        response?.data.message.map(({ property, constraints }) => {
          setFieldError(property, t(matchValidator(constraints)))
        })
      }
    }
  }

  return (
    <Grid container direction="column" component="section" className={classes.container}>
      <GenericForm
        enableReinitialize={true}
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">{t('bootcamp:form.edit-intern')}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormTextField
              type="text"
              label="auth:fields.first-name"
              name="firstName"
              autoComplete="first-name"
              value={initialValues.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormTextField
              type="text"
              label="auth:fields.last-name"
              name="lastName"
              autoComplete="family-name"
              value={initialValues.lastName}
            />
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" type="submit" color="secondary">
              {t('bootcamp:btns.save')}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <LinkButton fullWidth variant="contained" color="primary" href={routes.bootcamp.index}>
              {t('bootcamp:btns.cancel')}
            </LinkButton>
          </Grid>
        </Grid>
      </GenericForm>
    </Grid>
  )
}