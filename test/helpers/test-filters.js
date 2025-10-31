const PROFILE = process.env.PROFILE

export function describeWithAnnotations(desc, annotations = [], fn) {
  const hasProfile = typeof PROFILE === 'string' && PROFILE.trim() !== ''

  if (!hasProfile) {
    return describe(desc, fn)
  }

  const annotationsArray = Array.isArray(annotations) ? annotations : []
  const shouldRun = annotationsArray.indexOf(`@${PROFILE}`) !== -1

  if (shouldRun) {
    return describe(desc, fn)
  }

  return describe.skip(desc, fn)
}
