interface Props {
  search: string
  onSearch: (v: string) => void
  filterPriority: string
  onFilterPriority: (v: string) => void
  filterTag: string
  onFilterTag: (v: string) => void
  allTags: string[]
}

export default function FilterBar({ search, onSearch, filterPriority, onFilterPriority, filterTag, onFilterTag, allTags }: Props) {
  return (
    <div className="flex flex-wrap gap-3 px-4 py-2 border-b border-[#2a2d36]">
      <input
        placeholder="Search tasks…"
        value={search}
        onChange={e => onSearch(e.target.value)}
        className="bg-[#161a23] border border-[#2a2d36] rounded px-3 py-1 text-sm text-gray-300 outline-none focus:border-[#3baaff] min-w-[180px]"
      />

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
    </div>
  )
}
