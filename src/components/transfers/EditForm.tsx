import * as yup from 'yup'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { AxiosError, AxiosResponse } from 'axios'
import { useMutation, useQueryClient, UseQueryResult } from 'react-query'

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'

import { ApiErrors } from 'service/apiErrors'
import { endpoints } from 'service/apiEndpoints'
import { useEditTransfer } from 'service/transfer'

import { routes } from 'common/routes'
import { useVaultsList } from 'common/hooks/vaults'
import { usePersonList } from 'common/hooks/person'
import { useTransfer } from 'common/hooks/transfers'
import { useCampaignList } from 'common/hooks/campaigns'

import { AlertStore } from 'stores/AlertStore'
import { TransferData, TransferInput, TransferResponse } from 'gql/transfer'

import FormDate from './custom/FormDate'
import FormSelect from './custom/FormSelect'
import { Currency, TransferStatus } from './TransferTypes'
import GenericForm from 'components/common/form/GenericForm'
import SubmitButton from 'components/common/form/SubmitButton'
import FormTextField from 'components/common/form/FormTextField'

const dateParser = (date: Date | undefined) => {
  if (date) {
    return date.toString().slice(0, 10)
  }
  return undefined
}

const validationSchema: yup.SchemaOf<TransferData> = yup.object().shape({
  status: yup.string().oneOf(Object.values(TransferStatus)),
  currency: yup.string().oneOf(Object.values(Currency)).required(),
  amount: yup.number().positive('Amount must be a positive number.').required(),
  reason: yup.string().trim().min(1).max(300).required(),
  documentId: yup.string().uuid().notRequired().nullable(),
  targetDate: yup.date().min(new Date(), 'Date is invalid.').notRequired().nullable(),
  approvedById: yup.string().uuid().notRequired().nullable(),
  sourceVaultId: yup.string().uuid().required(),
  sourceCampaignId: yup.string().uuid(),
  targetVaultId: yup.string().uuid().required(),
  targetCampaignId: yup.string().uuid(),
})
export default function EditForm() {
  const { t } = useTranslation('transfer')

  const router = useRouter()
  const id = String(router.query.id)

  const queryClient = useQueryClient()
  const { data: transfer }: UseQueryResult<TransferResponse> = useTransfer(id)

  const { data: campaigns } = useCampaignList()
  const { data: vaults } = useVaultsList()
  const { data: people } = usePersonList()

  const [sourceCampaignId, setSourceCampaignId] = useState(transfer?.sourceCampaign?.id || '')
  const [targetCampaignId, setTargetCampaignId] = useState(transfer?.targetCampaign?.id || '')

  const initialValues: TransferInput = {
    status: transfer?.status,
    currency: transfer?.currency,
    amount: transfer?.amount || 0,
    reason: transfer?.reason || '',
    documentId: transfer?.documentId || '',
    targetDate: dateParser(transfer?.targetDate) || '',
    approvedById: transfer?.approvedBy?.id || '',
    sourceCampaignId: transfer?.sourceCampaign?.id || '',
    sourceVaultId: transfer?.sourceVault?.id || '',
    targetCampaignId: transfer?.targetCampaign?.id || '',
    targetVaultId: transfer?.targetVault?.id || '',
  }

  const mutation = useMutation<
    AxiosResponse<TransferResponse>,
    AxiosError<ApiErrors>,
    TransferInput
  >({
    mutationFn: useEditTransfer(id),
    onError: () => AlertStore.show(t('alerts:error'), 'error'),
    onSuccess: () => {
      AlertStore.show(t('alerts:create'), 'success')
      queryClient.invalidateQueries(endpoints.transfer.viewTransfer(id).url)
      router.push(routes.admin.transfer.index)
    },
  })

  function handleSubmit(values: TransferInput) {
    const data: TransferInput = {
      status: values.status,
      currency: values.currency,
      amount: values.amount,
      reason: values.reason,
      documentId: values.documentId ? values.documentId : null,
      targetDate: values.targetDate ? new Date(values.targetDate) : null,
      approvedById: values.approvedById ? values.approvedById : null,
      sourceCampaignId: sourceCampaignId,
      sourceVaultId: values.sourceVaultId,
      targetCampaignId: targetCampaignId,
      targetVaultId: values.targetVaultId,
    }
    if (!data.sourceCampaignId || !data.targetCampaignId) {
      return
    }
    mutation.mutate(data)
  }

  return (
    <GenericForm
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}>
      <Box>
        <Typography variant="h5" component="h2" sx={{ marginBottom: 2, textAlign: 'center' }}>
          {t('edit-form-heading')}
        </Typography>
        <Grid container spacing={2} sx={{ width: 600, margin: '0 auto' }}>
          <Grid item xs={12}>
            <FormSelect name="status" label={t('status')}>
              {(Object.values(TransferStatus) || []).map((status) => {
                return (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                )
              })}
            </FormSelect>
          </Grid>
          <Grid item xs={12}>
            <FormTextField type="string" label={t('reason')} name="reason" autoComplete="reason" />
          </Grid>
          <Grid item xs={12}>
            <FormSelect name="currency" label={t('currency')}>
              {(Object.values(Currency) || []).map((currency) => {
                return (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                )
              })}
            </FormSelect>
          </Grid>
          <Grid item xs={12}>
            <FormTextField type="number" label={t('amount')} name="amount" />
          </Grid>
          <Grid item xs={12}>
            <FormDate label={t('targetDate')} name="targetDate"></FormDate>
          </Grid>
          <Grid item xs={12}>
            <FormTextField
              type="string"
              label={t('documentId')}
              name="documentId"
              autoComplete="documentId"
            />
          </Grid>
          <Grid item xs={12}>
            <FormSelect name="approvedById" label={t('approvedBy')}>
              <MenuItem value="" key={'empty'}>
                <em>None</em>
              </MenuItem>
              {people?.map((p) => {
                return (
                  <MenuItem key={p.id} value={String(p.id)}>
                    {p.firstName} {p.lastName}
                  </MenuItem>
                )
              })}
            </FormSelect>
          </Grid>
          <Grid item xs={12}>
            <FormControl size="small" fullWidth>
              <InputLabel>{t('sourceCampaign')}</InputLabel>
              <Select
                type="string"
                sx={{ height: '55%' }}
                label={t('sourceCampaign')}
                name="sourceCampaignId"
                value={sourceCampaignId}
                onChange={(event) => setSourceCampaignId(event.target.value)}>
                <MenuItem value="" key={'empty'}>
                  <em></em>
                </MenuItem>
                {campaigns?.map((c) => {
                  return (
                    <MenuItem key={c.id} value={String(c.id)}>
                      {c.title}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormSelect name="sourceVaultId" label={t('sourceVault')}>
              <MenuItem value="" key={'empty'}>
                <em></em>
              </MenuItem>
              {vaults?.map((v) => {
                if (v.campaignId === sourceCampaignId) {
                  return (
                    <MenuItem key={v.id} value={String(v.id)}>
                      {v.name}
                    </MenuItem>
                  )
                }
              })}
            </FormSelect>
          </Grid>
          <Grid item xs={12}>
            <FormControl size="small" fullWidth>
              <InputLabel>{t('targetCampaign')}</InputLabel>
              <Select
                type="string"
                label={t('targetCampaign')}
                name="targetCampaignId"
                value={targetCampaignId}
                onChange={(event) => setTargetCampaignId(event.target.value)}>
                <MenuItem value="" key={'empty'}>
                  <em></em>
                </MenuItem>
                {campaigns?.map((c) => {
                  return (
                    <MenuItem key={c.id} value={String(c.id)}>
                      {c.title}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormSelect name="targetVaultId" label={t('targetVault')}>
              <MenuItem value="" key={'empty'}>
                <em></em>
              </MenuItem>
              {vaults?.map((v) => {
                if (v.campaignId === targetCampaignId) {
                  return (
                    <MenuItem key={v.id} value={String(v.id)}>
                      {v.name}
                    </MenuItem>
                  )
                }
              })}
            </FormSelect>
          </Grid>
          <Grid item xs={6}>
            <SubmitButton fullWidth label={t('transfer:cta:submit')} />
          </Grid>
          <Grid item xs={6}>
            <Link href={routes.admin.transfer.index} passHref>
              <Button fullWidth>{t('transfer:cta:cancel')}</Button>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </GenericForm>
  )
}