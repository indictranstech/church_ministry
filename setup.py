from setuptools import setup, find_packages
import os

version = '0.0.1'

setup(
    name='church_ministry',
    version=version,
    description='Church Ministry',
    author='New Indictrans technologies Pvt. Ltd.',
    author_email='info@indictranstech.com',
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=("frappe",),
)
