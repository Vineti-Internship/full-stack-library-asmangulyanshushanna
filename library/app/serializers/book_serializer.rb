class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :rating, :url, :author_id
end
