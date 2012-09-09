class Gene
  constructor: (code) ->
    @code = code || ''
    @cost = 9999;
    
  randomize: (length) ->
    @code = ''
    @code += String.fromCharCode(Math.floor(Math.random() * 255)) while length--
    
  calculate_cost: (compare) ->
    total = 0
    for i in [0..(compare.length - 1)]
      total += Math.pow((@code.charCodeAt(i) - compare.charCodeAt(i)),2)
    @cost = total
    
  mate: (gene) ->
    pivot = Math.round(@code.length / 2) - 1
    child_one = @code.substr(0,pivot) + gene.code.substr(pivot)
    child_two = gene.code.substr(0,pivot) + @code.substr(pivot)
    [new Gene(child_one), new Gene(child_two)]

  mutate: (chance) ->
    return if Math.random() > chance
    rand = Math.floor(Math.random() * @code.length)
    direction = (if Math.random() <= 0.5 then -1 else 1)
    chars = @code.split("")
    chars[rand] = String.fromCharCode(@code.charCodeAt(rand) + direction)
    @code = chars.join("") 


class Population
  
  constructor: (goal,size) ->
    @members = []
    @generation = 0
    @goal = goal
    while size--
      gene = new Gene()
      gene.randomize(@goal.length)
      @members.push(gene)
      
  sort: ->
    @members.sort (a,b) -> a.cost - b.cost
  
  display: ->
    document.getElementById("generation").innerHTML = @generation
    content = ""
    content += "<li>#{gene.code} <em>(#{gene.cost})</em></li>" for gene in @members
    document.getElementById("list").innerHTML = content
    
  run_generation: ->
    gene.calculate_cost(@goal) for gene in @members
    @sort()
    @display()
    children = @members[0].mate(@members[1])
    @members.splice(@members.length - 2, 2, children[0], children[1])
    for gene in @members
      gene.mutate(0.3)
      gene.calculate_cost(@goal)
      if gene.code == @goal
        @sort()
        @display()
        return true
        
    @generation++
    setTimeout (=>
      @run_generation()
    ), 20
    
      
population = new Population("Hello, world!", 20)
population.run_generation()

  