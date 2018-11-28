class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :rating, :author_id
end
