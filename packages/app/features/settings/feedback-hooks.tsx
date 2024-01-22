import { createParam } from 'solito'

type FeedbackApp = {
  overallExperienceRating: string
  voiceQualityRating: string
  contextRelevencyRating: string
  characteristicsConsistencyRating: string
  comment: string
}

const { useParam } = createParam<FeedbackApp>()

export const useRating = () => {
  const [overallExperienceRating, setOverallExperienceRating] = useParam('overallExperienceRating')
  const [voiceQualityRating, setVoiceQualityRating] = useParam('voiceQualityRating')
  const [contextRelevencyRating, setContextRelevencyRating] = useParam('contextRelevencyRating')
  const [characteristicsConsistencyRating, setCharacteristicsConsistencyRating] = useParam(
    'characteristicsConsistencyRating'
  )
  return {
    overallExperienceRating,
    voiceQualityRating,
    contextRelevencyRating,
    characteristicsConsistencyRating,
    setOverallExperienceRating,
    setVoiceQualityRating,
    setContextRelevencyRating,
    setCharacteristicsConsistencyRating,
  }
}

export const useComment = () => {
  const [comment, setComment] = useParam('comment')
  return {
    comment,
    setComment,
  }
}
