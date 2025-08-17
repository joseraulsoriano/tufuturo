const BASE_URL = 'https://volunteer-mcp-production.up.railway.app';

export interface EducationSearchParams {
  query: string;
  topK?: number;
}

export interface JobsSearchParams {
  query: string;
  location?: string;
  topK?: number;
}

export interface VolunteerMxSearchParams {
  filters?: Record<string, unknown>;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`MCP request failed: ${response.status} ${response.statusText} ${text}`);
  }
  return response.json();
}

export function extractResultsArray(payload: any): any[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload.results,
    payload.data,
    payload.items,
    payload.result?.results,
    payload.result?.data,
    payload.result?.items,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

function coalesceString(...values: any[]): string | undefined {
  for (const v of values) {
    if (v == null) continue;
    if (typeof v === 'string' && v.trim().length > 0) return v.trim();
    if (typeof v === 'number') return String(v);
    if (typeof v === 'object') {
      if (typeof (v as any).name === 'string') return (v as any).name;
      if (typeof (v as any).title === 'string') return (v as any).title;
      if (typeof (v as any).text === 'string') return (v as any).text;
    }
  }
  return undefined;
}

function buildLocation(item: any): string | undefined {
  // Prefer array of locations if present
  if (Array.isArray(item.locations)) {
    const parts = item.locations
      .map((l: any) => {
        if (typeof l === 'string') return l;
        if (l && typeof l === 'object') {
          return [l.city || l.ciudad, l.state || l.estado, l.country || l.pais]
            .filter(Boolean)
            .join(', ');
        }
        return undefined;
      })
      .filter(Boolean);
    if (parts.length) return parts.join(', ');
  }

  const loc = item.location || item.ubicacion || item.address || item.direccion || item.city || item.ciudad;
  if (!loc) return undefined;
  if (typeof loc === 'string') return loc;
  if (typeof loc === 'object') {
    const parts = [
      loc.city || loc.ciudad || loc.municipio,
      loc.state || loc.estado,
      loc.country || loc.pais,
    ].filter(Boolean);
    if (parts.length) return parts.join(', ');
  }
  return undefined;
}

export function normalizeVolunteerOpportunity(item: any, index: number) {
  const title = coalesceString(item.title, item.position, item.role, item.name, item.titulo) || 'Volunteer Opportunity';
  const organization = coalesceString(
    item.org,
    item.organization?.name,
    item.organization_name,
    item.organization,
    item.organizacion,
    item.org,
  ) || 'Organization';

  const description = coalesceString(item.details, item.need, item.description, item.summary, item.descripcion) || 'Help make a difference in your community.';
  const location = buildLocation(item) || 'Location TBD';
  const duration = coalesceString(item.availability, item.time_commitment, item.duration, item.duracion, item.horario) || 'Flexible';
  const applicationLink = coalesceString(item.apply_link, item.link, item.url, item.website, item.apply_url, item.enlace) || 'https://example.com';

  let image = coalesceString(item.image_url, item.image, item.imagen, item.foto);
  if (!image && Array.isArray(item.images) && item.images.length > 0) {
    const first = item.images[0];
    image = typeof first === 'string' ? first : coalesceString(first?.url, first?.src, first?.href);
  }
  if (!image) image = 'https://via.placeholder.com/150';

  // career can be array or string
  let type: any = item.career ?? item.category ?? item.interest_area ?? item.type ?? item.tipo;
  if (Array.isArray(type)) type = type.join(', ');
  type = coalesceString(type) || 'General';

  let requiredSkills: any = item.skills || item.requirements || item.habilidades;
  if (typeof requiredSkills === 'string') {
    requiredSkills = requiredSkills.split(/[,;]\s*/).filter(Boolean);
  }
  if (!Array.isArray(requiredSkills)) requiredSkills = ['No specific skills required'];

  const benefits = coalesceString(item.benefits, item.beneficios) || 'Gain experience, build connections, make a difference.';
  const financialSupport = coalesceString(item.salary, item.financial_support, item.compensation, item.apoyo_economico) || 'No remunerado / N/A';
  const applicationDeadline = coalesceString(item.deadline, item.end_date, item.fecha_limite) || 'Ongoing';

  return {
    id: item.id ?? item._id ?? index,
    title,
    organization,
    description,
    location,
    duration,
    applicationLink,
    image,
    type,
    requiredSkills,
    benefits,
    financialSupport,
    applicationDeadline,
    postedAt: item.posted_at || item.postedAt || undefined,
  };
}

export const mcp = {
  education: {
    search: (params: EducationSearchParams) => postJson<any>('/mcp/education.search', params),
  },
  jobs: {
    search: (params: JobsSearchParams & { career?: string }) => postJson<any>('/mcp/jobs.search', params),
    list: () => postJson<any>('/mcp/jobs.list', {}),
  },
  learning: {
    save: (profileId: string, plan: any) => postJson<any>('/mcp/learning.plan.save', { profile_id: profileId, plan }),
    get: (profileId: string) => postJson<any>('/mcp/learning.plan.get', { profile_id: profileId }),
  },
  volunteer: {
    mxSearch: (params: VolunteerMxSearchParams) => postJson<any>('/mcp/volunteer.mx_search', params),
  },
  call: (tool: string, params: Record<string, unknown>) =>
    postJson<any>('/mcp/call', { tool, params }),
};

export function normalizeJobs(resp: any): { items: any[]; fallback: any[]; count: number } {
  const r = resp?.result || {};
  const enriched = (r.enriched || []).map((e: any) => ({
    title: e.title,
    link: e.link,
    org: e.organization,
    location: e.location,
    posted_at: e.posted_at,
    images: e.images || [],
    snippet: e.snippet || '',
    type: 'enriched',
  }));
  const headlines = (r.headlines || []).map((h: any) => ({
    title: h.title,
    link: h.url,
    snippet: h.snippet,
    org: h.org || '',
    location: h.location || '',
    type: 'headline',
  }));
  const fallback = r.fallback_type === 'volunteer'
    ? (r.fallback?.results || []).map((v: any) => ({
        title: v.title || v.role,
        org: v.org,
        link: v.apply_link || v.link,
        location: Array.isArray(v.locations) ? v.locations.join(', ') : (v.location || ''),
        source: v.source,
      }))
    : [];
  return { items: [...enriched, ...headlines], fallback, count: r.count || 0 };
}

export default mcp;


