class Book < ApplicationRecord
  belongs_to :author
  validates :title, presence: true
  validates :rating, presence: true
  validates :url, format: { with: /\A(http|https):\/\/.*/ }
end
