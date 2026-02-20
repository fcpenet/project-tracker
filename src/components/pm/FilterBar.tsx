interface EpicOption {
  id: number
  title: string
}

interface Props {
  search: string
  onSearch: (v: string) => void
  filterStatus: string
  onFilterStatus: (v: string) => void
  filterPriority: string
  onFilterPriority: (v: string) => void
  filterTag: string
  onFilterTag: (v: string) => void
  allTags: string[]
  filterEpic: string
  onFilterEpic: (v: string) => void
  allEpics: EpicOption[]
}

export default function FilterBar({ search, onSearch, filterStatus, onFilterStatus, filterPriority, onFilterPriority, filterTag, onFilterTag, allTags, filterEpic, onFilterEpic, allEpics }: Props) {
  return (
    <div className="flex flex-wrap gap-3 px-4 py-2 border-b border-[#2a2d36]">
      <input
        placeholder="Search tasks…"
        value={search}
        onChange={e => onSearch(e.target.value)}
        className="bg-[#161a23] border border-[#2a2d36] rounded px-3 py-1 text-sm text-gray-300 outline-none focus:border-[#3baaff] min-w-[180px]"
      />

      <select
        value={filterStatus}
        onChange={e => onFilterStatus(e.target.value)}
        className="bg-[#161a23] border border-[#2a2d36] rounded px-2 py-1 text-sm text-gray-300"
      >
        <option value="all">All statuses</option>
        {['backlog', 'in progress', 'review', 'done'].map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        value={filterPriority}
        onChange={e => onFilterPriority(e.target.value)}
        className="bg-[#161a23] border border-[#2a2d36] rounded px-2 py-1 text-sm text-gray-300"
      >
        <option value="all">All priorities</option>
        {['urgent', 'high', 'medium', 'low'].map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <select
        value={filterTag}
        onChange={e => onFilterTag(e.target.value)}
        className="bg-[#161a23] border border-[#2a2d36] rounded px-2 py-1 text-sm text-gray-300"
      >
        <option value="all">All tags</option>
        {allTags.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {allEpics.length > 0 && (
        <select
          value={filterEpic}
          onChange={e => onFilterEpic(e.target.value)}
          className="bg-[#161a23] border border-[#2a2d36] rounded px-2 py-1 text-sm text-gray-300"
        >
          <option value="all">All epics</option>
          {allEpics.map(e => (
            <option key={e.id} value={String(e.id)}>{e.title}</option>
          ))}
        </select>
      )}
    </div>
  )
}
