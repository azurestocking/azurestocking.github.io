# Prevent draft projects from being built.
# Documents in the "projects" collection with draft: true are removed
# from the collection so no HTML is generated for them.
Jekyll::Hooks.register(:site, :post_read) do |site|
  projects = site.collections["projects"]
  next unless projects

  projects.docs.reject! { |doc| doc.data["draft"] == true }
end
