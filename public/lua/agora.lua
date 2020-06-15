state.var {
  councils = state.map(),
  agendas = state.map(),
  agenda_arr = state.array(),
  voters = state.map(2),
  categories = state.value(),
  statuses = state.value()
}

function constructor()
    if categories:get() == nil then
        categories:set({})
    end
    addCategory('argus')
    addCategory('dodona')
    addCategory('agora')
    if statuses:get() == nil then
        statuses:set({})
    end
    addStatus('open')
    addStatus('closed')
end

function addCouncil(council)
    assert(system.getCreator() == system.getSender(), "only onwer can call")
    councils[council] = true
end

function removeCouncil(council)
    assert(system.getCreator() == system.getSender(), "only owner can call")
    councils:delete(council)
end

function issueAgenda(hash, aip, title, category, startDate, endDate)
    assert(councils[system.getSender()] ~= nil, "only a council can issues a agenda")
    -- XXX ignore?
    if agendas[hash] == nil then
        agenda_arr:append({
            ["aip"] = aip,
            ["title"] = title,
            issuer = system.getSender(),
            status = "open",
            ["startDate"] = startDate,
            ["endDate"] = endDate,
            confirm = 0,
            reject = 0
        })
        agendas[hash] = agenda_arr:length()
    end
end

function _getAgenda(hash)
    local i = agendas[hash]
    if i == nil then
        return nil
    end
    return agenda_arr[i]
end

function _setAgenda(hash, agenda)
    local i = agendas[hash]
    if i ~= nil then
        agenda_arr[i] = agenda
    end
end

function finishAgenda(hash)
    local agenda = _getAgenda(hash)
    assert(agenda ~= nil, string.format("not found the agenda: %s", hash))
    assert(agenda.issuer == system.getSender(), string.format("'%s' is not the issuer", system.getSender()))
    agenda.status = "closed"
    _setAgenda(hash, agenda)
end

function confirmAgenda(hash)
    local agenda = _getAgenda(hash)
    assert(agenda ~= nil, string.format("not found the agenda: %s", hash))
    -- XXX check staking
    local voter = system.getSender()
    if voters[hash][voter] then
        return
    end
    voters[hash][voter] = 1
    agenda.confirm = agenda.confirm + 1
    _setAgenda(hash, agenda)
end

function rejectAgenda(hash)
    local agenda = _getAgenda(hash)
    assert(agenda ~= nil, string.format("not found the agenda: %s", hash))
    -- XXX check staking
    local voter = system.getSender()
    if voters[hash][voter] then
        return
    end
    voters[hash][voter] = 0
    agenda.reject = agenda.reject + 1
    _setAgenda(hash, agenda)
end

function addCategory(category)
    assert(system.getCreator() == system.getSender(), "only onwer can call")
    local h = categories:get()
    h[category] = true
    categories:set(h)
end

function removeCategory(category)
    -- XXX depedent agendas?
    assert(system.getCreator() == system.getSender(), "only onwer can call")
    local h = categories:get()
    h[category] = nil
    categories:set(h)
end

function addStatus(status)
    assert(system.getCreator() == system.getSender(), "only onwer can call")
    local h = statuses:get()
    h[status] = true
    statuses:set(h)
end

function removeStatus(status)
    -- XXX depedent agendas?
    assert(system.getCreator() == system.getSender(), "only onwer can call")
    local h = statuses:get()
    h[status] = nil
    statuses:set(h)
end

function listAgendas()
    local arr = {}
    for i, v in agenda_arr:ipairs() do
        table.insert(arr, v)
    end
    return arr
end

function listCategories()
    return _keys(categories:get())
end

function listStatus()
    return _keys(statuses:get())
end

function _keys(h)
    local arr = {}
    for k, v in pairs(h) do
        table.insert(arr, k)
    end
    return arr
end

abi.register(
    addCouncil, removeCouncil,
    issueAgenda, finishAgenda, confirmAgenda, rejectAgenda, 
    addCategory, removeCategory,
    addStatus, removeStatus)

abi.register_view(listAgendas, listCategories, listStatus)

